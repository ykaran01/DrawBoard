import  Joi from 'joi'
const schema = Joi.object({
    name:Joi.string().min(2).max(30).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(2).max(10).required(),
    username:Joi.string().min(2).max(20).required(),
})

export const joiMiddleware = async (req ,res,next)=>{
        const {error,value} = schema.validate(req.body)
        if(error){
            return res.status(400).json({
                success:false,
                message:"Data is Not correct"
            })
        }
        next()
}
