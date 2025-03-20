const JWTService = require('../services/JWTService'); // Adjust the path as needed

const authenticateJWT = (allowedRoles = []) => async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        console.log("Authheader", authHeader)
        const token = authHeader ? authHeader.replace('Bearer ', '') : null;

        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const tokenExpired = await JWTService.isTokenExpired(token);
        console.log("Token Expired", tokenExpired)
        if (tokenExpired) {
            return res.status(403).json({ error: 'Token expired' });
        }

        const validToken = await JWTService.isTokenValid(token);
        console.log("Valid Token", validToken)
        if (!validToken) {
            return res.status(401).json({ error: 'Token not valid' });
        }

        req.user = validToken;

        const userRole = req.user.role.name;

        if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
            return res.status(401).json({ error: 'Access denied. Insufficient permissions.' });
        }

        next(); // Proceed to the next middleware
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(400).json({ error: 'An error occurred during authentication.' });
    }
};

module.exports = authenticateJWT;
