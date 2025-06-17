const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");
const teacher = require("../middleware/teacher.middleware");

const {
  categoryRequest,
  approveCategoryRequest,
  rejectCategoryRequest,
  viewCategoryRequests,
  deleteCategory,
  viewCategories,
  viewPendingCategoryRequests,
  updateCategory,
  getSpecificCategory,
  getAllCategoryNames,
  getSubscribedCategories
} = require("../controllers/category.controller");

router.get('/:userId/categories', getSubscribedCategories);

// Create a new category request
router.post("/request", [auth, teacher], categoryRequest);

// Approve a category request
router.put("/:id/approve", [auth, admin], approveCategoryRequest);

// Reject a category request
router.put("/:id/reject", [auth, admin], rejectCategoryRequest);

// view all requests
router.get("/request", [auth, admin], viewCategoryRequests);

router.get("/request/pending", [auth, admin], viewPendingCategoryRequests);

// view all categories
router.get("/", [auth], viewCategories);

// get specific category
router.get("/:id", auth, getSpecificCategory)

//delete a category
router.delete("/:id", [auth, admin], deleteCategory);

// Update a category's tags and description
router.put('/:id/update', updateCategory);

//get posts from a category
// router.get("/:categoryId/posts", getPostsByCategory)

//add category update routes and logic

module.exports = router;
