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
        if(!decodedData.isVerified){
            return res.status(401).json({
                success: false,
                message: "Unauthorise."
            });
        }
        
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


export const socketAuth = async (socket, next) => {
  try {
    const cookies = socket.handshake.headers?.cookie;
    let token = cookies.split(";").find((cookie)=>cookie.trim().startsWith("accessToken="))
    token = token.split("=")[1]
    if (!token) {
      return next(new Error("Authentication required"));
    }
    const decoded =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      return  (new Error("User not found"));
    }
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error("Invalid or expired token"));
  }
};