const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User, validateRegistration } = require("../models/user.model");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Create a transporter object with your email service provider settings
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Example: using Gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


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
      
      res.cookie('token', token, {
        httpOnly: true, // Prevents JavaScript access to the cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS)
        //secure: false, // Use secure cookies in production (HTTPS)
        sameSite: 'strict', // Helps protect against CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      console.log("Logged in Successfully")
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
  res.cookie('token', '', { expires: new Date(0), httpOnly: true, secure: false, sameSite: 'strict'});
  res.status(200).send({ message: 'Logged out successfully' });
}

const checkAuth = async (req, res) => {
  // Check if the token is present in the cookies
  const token = req.cookies.token;

  if (!token) {
    // console.log("token not provided");
    return res.status(401).send({ authenticated: false, message: "No token provided, authorization denied." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id).select('-password') // exclude password from response to client
    // console.log(user)

    res.status(200).send({ authenticated: true, user, message: "Authenticated" });
  } catch (error) {
    res.status(401).send({ authenticated: false, message: "Invalid token, authorization denied." });
  }
};

const sendVerificationEmail = async (req, res) => {
  const userId = req.user._id;
  // console.log(userId)
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Generate and save the email verification token
    const emailToken = user.generateEmailVerificationToken();
    await user.save();

    // Compose the verification email
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${emailToken}`;
    const mailOptions = {
      from: 'uvanceddtube@gmail.com', // Sender address
      to: user.email, // List of receivers
      subject: 'Email Verification', // Subject line
      html: `
        <p>Hi ${user.firstName},</p>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>If you did not register for an account, please ignore this email.</p>
      `, // HTML body
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).send({ message: 'Verification email sent successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Failed to send verification email.' });
  }
};

const verifyUserEmail = async (req, res) => {
  const { token } = req.query; // Extract the token from the query parameters

  if (!token) {
    return res.status(400).send({ message: "Verification token is required." });
  }

  try {
    // Find the user with the provided token
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(404).send({ message: "User not found or token is invalid." });
    }

    // Check if the token is valid and has not expired
    if (user.emailVerificationTokenExpires < Date.now()) {
      return res.status(400).send({ message: "Token has expired. Please request a new verification email." });
    }

    // Verify the token
    const result = user.verifyEmailToken(token);

    if (result.success) {
      // Save changes to the database
      await user.save();
      return res.status(200).send({ message: "Email verified successfully." });
    } else {
      return res.status(400).send({ message: result.message });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "An error occurred while verifying your email." });
  }
};


module.exports = { loginUser, verifyUserEmail, createUser, logoutUser, checkAuth , sendVerificationEmail}