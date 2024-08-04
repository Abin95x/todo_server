import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

const auth = (req, res, next) => {
    const token = req.headers.authorization
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY_USER);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};

export default auth

