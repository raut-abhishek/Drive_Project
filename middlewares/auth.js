const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.cookies.token; // get JWT from cookie

    if (!token) {
        // User is not logged in → redirect to login page
        return res.redirect('/user/login');
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to request
        req.user = decoded;

        // Continue to next middleware/route
        next();
    } catch (err) {
        // Invalid or expired token → redirect to login
        return res.redirect('/user/login');
    }
}

module.exports = auth;
