const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User, validateRegistration } = require("../models/user.model");

const createUser = async (req, res) => {
  try {
      const { error } = validateRegistration(req.body);
      if (error) {
          return res.status(400).send({ message: error.details[0].message });
      }

      const user = await User.findOne({ email: req.body.email });
      if (user) {
          return res.status(409).send({ message: "User with entered email already exists." });
      }

      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.password, salt);

      await new User({ ...req.body, password: hashPassword }).save();
      res.status(201).send({ message: "User Created Successfully!" });
  } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
  }
};

const authenticateUser = async (req,res) => {
  try {
      const {error} = validateLogin(req.body);
      if (error)
          return res.status(400).send({message: error.details[0].message});

      const user = await User.findOne({email: req.body.email});
      if(!user){
          return res.status(401).send({message: "Invalid Email or Password!"});
      }

      const validPassword = await bcrypt.compare(req.body.password, user.password);

      if(!validPassword){
          return res.status(401).send({message: "Invalid Email or Password!"});
      }

      const token = user.generateAuthToken();
      res.status(200).send({data: token, message: "Logged In Successfully"})
  } catch (error) {
      res.status(500).send({message: "Internal Server Error"});
  }
};

const validateLogin = (data) => {
  const schema = Joi.object({
      email: Joi.string().email().required().label("Email"),
      password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
}

module.exports = { authenticateUser, createUser }