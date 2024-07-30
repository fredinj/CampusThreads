const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    // Get token from cookies instead of headers
    const token = req.cookies.token;
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('Authenticated user:', req.user); // Debugging log
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
}

module.exports = auth;