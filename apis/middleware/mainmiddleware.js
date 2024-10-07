const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();

const mainmiddleware = (req, res, next) => {
    const isToken = req.headers['authorization'];
    if (!isToken) {
        return res.status(401).json({ message: "Login first" });
    }
    const bearertoken = isToken.split(' ')[1];
    
    try {
        const isVerified = jwt.verify(bearertoken, process.env.Secret_key);
        req.userRole = isVerified.role;
        // console.log(req.userRole);
        
        
        next();
    } catch (err) {
        return res.status(403).json({ message: "User Not authorized" });
    }
}

module.exports = mainmiddleware;
