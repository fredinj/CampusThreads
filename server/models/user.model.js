const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student",
  },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: [] }],
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: '' },
  lastLogin: { type: Date },
  accountStatus: {
    type: String,
    enum: ["active", "suspended", "deleted"],
    default: "active",
  },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },  
  emailVerificationTokenExpires: { type: Date },
},
{ timestamps: true });


userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return token;
};

userSchema.methods.generateEmailVerificationToken = function () {
  // Generate a JWT token for email verification
  const token = jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" } // Set the token to expire in 30 (you can adjust this as needed)
  );

  // Store the token and expiration time in the user object
  this.emailVerificationToken = token;
  this.emailVerificationTokenExpires = Date.now() + 0.5 * 60 * 60 * 1000; // 24 hours from now

  // Return the token so it can be used in the verification email
  return token;
};

userSchema.methods.verifyEmailToken = function (token) {
  // Verify the token using the secret key
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token matches the stored token and hasn't expired
    if (
      token === this.emailVerificationToken &&
      this.emailVerificationTokenExpires > Date.now()
    ) {
      // Token is valid, mark email as verified
      this.emailVerified = true;
      
      // Remove the token and expiration date from the user object
      this.emailVerificationToken = undefined;
      this.emailVerificationTokenExpires = undefined;

      return { success: true, message: "Email verified successfully." };
    } else {
      return { success: false, message: "Token is invalid or has expired." };
    }
  } catch (err) {
    // Handle any errors that occur during token verification
    return { success: false, message: "Invalid token." };
  }
};


const User = mongoose.model("user", userSchema);

const validateRegistration = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    role: Joi.string().valid("student", "teacher", "admin").label("Role"),
  });
  return schema.validate(data);
};



module.exports = { User, validateRegistration };