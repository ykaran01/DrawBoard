import { Router } from "express";
import { getAllMessages } from "../controllers/message.controller.js";
import { userMiddleware } from "../middleware/jwt.middleware.js";
export const messageRouter = Router()

messageRouter.use(userMiddleware)

messageRouter.get('/:roomId',getAllMessages)