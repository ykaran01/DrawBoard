import {Router} from 'express'
import { addOrUpdateAvatar, loginUser, registerUser, verifyUser ,getUser, refresh, changeName, logout } from '../controllers/user.contoller.js'
import { upload } from '../middleware/multter.middleware.js'
import { userMiddleware } from '../middleware/jwt.middleware.js'
import { joiMiddleware } from '../middleware/joi.middleware.js'
const user = Router()

user.post('/register',joiMiddleware,registerUser)
user.post('/login',loginUser)


user.patch('/avatar',userMiddleware,upload.single("avatar"),addOrUpdateAvatar)
user.post('/otp',verifyUser)
user.get('/me',userMiddleware,getUser)
user.post('/refresh',refresh)
user.patch('/name',userMiddleware,changeName)
user.post('/logout',userMiddleware,logout)

export {user}