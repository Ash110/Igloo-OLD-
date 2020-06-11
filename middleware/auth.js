const jwt = require('jsonwebtoken');
const config = require('config');

const auth = (req, res, next) => {
    //Get the token from the header
    //Check if token exists
    if (!req.cookies.userToken) {
        return res.status(401).json({ msg: "No Token. Auth Denied" });
    }

    try {
        //This is a secret key in SHA256
        const decoded = jwt.verify(req.cookies.userToken, config.get('jwtSecret'));
        //Return only the user ID if valid
        req.id = decoded.id.slice(0, decoded.id.length / 2);
        next();
    } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
    }
}


module.exports = auth;