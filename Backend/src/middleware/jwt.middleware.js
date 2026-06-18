import jwt from 'jsonwebtoken'

export const userMiddleware = async(req, res, next) => {
    try {
        const token  = req.headers['Authorization'].split(" ")[1] || res.cookie("accessToken");
        if(!token){
            res.status(404).json({
                success:false,
                message:"Could not find the token "
            })
        }
        const data = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        if(!data){
            res.status(200).json({
                success:false,
                message:"Token is not correct"
                
        })
        }
        req.user = data
        next()

     } catch (err) {
        throw new Error("Something went wrong In JWt Token")
    }


}