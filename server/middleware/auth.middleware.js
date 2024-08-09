const jwt = require('jsonwebtoken');
const { User } = require("../models/user.model")

async function auth(req, res, next) {
    // Get token from cookies instead of headers
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select('-password') // exclude password from response to client
        req.user = user;

        console.log('Authenticated user:', req.user); // Debugging log
      next();
    } catch (error) {
        res.status(400).send('Invalid token.');
    }
}

module.exports = auth;