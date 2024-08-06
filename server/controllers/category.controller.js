const mongoose = require('mongoose'); 

const CategoryRequest = require("../models/category-request.model");
const Category = require("../models/category.model")
const Joi = require("joi");

const viewCategoryRequests =  async (req, res) => { 
    try {
        const requests = await CategoryRequest.find();
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const categoryRequest = async (req, res) => {
    try {
        const { error } = validateRequest(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });
  
        const categoryRequest = await CategoryRequest.findOne({categoryName: req.body.categoryName});
        if (categoryRequest){
          if (categoryRequest.status === 'pending')
            return res.status(409).send({message: "Pending category request with same name exists", firstDuplicateId: categoryRequest._id});
        }
  
        const request = new CategoryRequest({
            categoryName: req.body.categoryName,
            description: req.body.description,
            requestedBy: req.user._id,
            tags: req.body.tags // Include tags in the request
        });
  
        await request.save();
        res.status(201).send({ message: 'Request created successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
  };
  

const approveCategoryRequest = async (req, res) => {
    const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId(req.params.id)) return res.status(400).send({ message: 'Invalid request ID' });
    
    try {
        const request = await CategoryRequest.findById(req.params.id);
        if (!request) return res.status(404).send({ message: 'Request not found' });
        if (request.status === 'approved') return res.status(409).send({ message: 'Request already approved' });
        
        const category = await Category.findOne({ name: request.categoryName });
        if (category) return res.status(409).send({ message: "Category with the same name already exists", existingCategoryId: category._id });
  
        request.status = 'approved';
        await request.save();
  
        await new Category({
            name: request.categoryName,
            description: request.description,
            requestedBy: request.requestedBy,
            requestId: request._id,
            tags: request.tags // Include tags in the new category
        }).save();
  
        res.send({ message: 'Request approved and category created' });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
  };
  

const rejectCategoryRequest = async (req, res) => {
  const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
  if (!isValidObjectId(req.params.id)) return res.status(400).send({ message: 'Invalid request ID' });

  try {
      const request = await CategoryRequest.findById(req.params.id);
      if (!request) return res.status(404).send({ message: 'Request not found' });
      if (request.status === 'approved') return res.status(409).send({ message: 'Request already approved' })

      request.status = 'rejected';
      await request.save();
      res.send({ message: 'Request rejected' });
  } catch (error) {
      res.status(500).send({ message: 'Internal Server Error' });
  }
}

const viewCategories = async (req, res) => { 
  try {
      const requests = await Category.find();
      res.status(200).json(requests);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

const deleteCategory = async (req, res) => {
  const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
  if (!isValidObjectId(req.params.id)) return res.status(400).send({ message: 'Invalid request ID' });

  try {
      // Find the category by ID and delete it
      console.log(req.params.id)
      const category = await Category.findByIdAndDelete(req.params.id);

      if (!category) {
          return res.status(404).json({ message: 'Category not found' });
      }

      return res.status(200).json({ message: 'Category deleted successfully', category });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
}

const validateRequest = (data) => {
    const schema = Joi.object({
        categoryName: Joi.string().required().label('Category Name'),
        description: Joi.string().required().label('Description'),
        tags: Joi.array().items(Joi.string()).label('Tags') // Validate tags as an array of strings
    });
    return schema.validate(data);
  };
  

module.exports = { categoryRequest, approveCategoryRequest, rejectCategoryRequest, viewCategoryRequests, deleteCategory, viewCategories }