import jwt from 'jsonwebtoken';

export const userMiddleware = async (req, res, next) => {
    try {
       
        const token = req.cookies?.accessToken; 
           
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token missing. Please log in."
            });
        }
        
        const decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = decodedData;
        
        next();

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Access token expired" 
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid token verification failed"
        });
    }
};