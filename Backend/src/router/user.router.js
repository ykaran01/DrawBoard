import {Router} from 'express'
import { addOrUpdateAvatar, loginUser, registerUser, verifyUser } from '../controllers/user.contoller.js'
import { upload } from '../middleware/multter.middleware.js'
import { userMiddleware } from '../middleware/jwt.middleware.js'
const user = Router()

user.post('/register',registerUser)
user.post('/login',loginUser)
user.patch('/avatar',userMiddleware,upload.single("avatar"),addOrUpdateAvatar)
user.post('/otp',verifyUser)

export {user}