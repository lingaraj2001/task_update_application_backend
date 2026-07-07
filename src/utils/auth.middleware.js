const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_987654321';

module.exports = (req, res, next) => {
    // Check for token in Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Access Denied: No token provided.'
        });
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access Denied: Invalid token format.'
        });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified; // Attach verified user payload (contains id, email, username)
        req.userId = verified.id; // Helper shortcut for user ID
        next();
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: 'Access Denied: Invalid or expired token.'
        });
    }
};
