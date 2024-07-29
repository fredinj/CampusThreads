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

const loginUser = async (req,res) => {
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
      // res.status(200).send({data: token, message: "Logged In Successfully"})

      res.cookie('token', token, {
        httpOnly: true, // Prevents JavaScript access to the cookie
        // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS)
        secure: true, // Use secure cookies in production (HTTPS)
        sameSite: 'strict', // Helps protect against CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      res.status(200).send({ message: "Logged In Successfully" });
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

const logoutUser = (req, res) => {
  // Clear the token cookie
  res.cookie('token', '', { expires: new Date(0), httpOnly: true, secure: true, sameSite: 'strict', secure: true});
  res.status(200).send({ message: 'Logged out successfully' });
}

const checkAuth = (req, res, next) => {
  // Check if the token is present in the cookies
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: "No token provided, authorization denied." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user data to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).send({ message: "Invalid token, authorization denied." });
  }
};


module.exports = { loginUser, createUser, logoutUser, checkAuth }