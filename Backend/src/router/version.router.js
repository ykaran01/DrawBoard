import {Router} from "express"
import { userMiddleware } from "../middleware/jwt.middleware.js"
import { deleteVersion, getAllUserVerionBoard, getVersion, saveVersion } from "../controllers/verion.contoller.js"

export const versionRouter = Router()

versionRouter.use(userMiddleware)

versionRouter.post('/:id',saveVersion)
versionRouter.get('/:id',getVersion)
versionRouter.get('/:id/all',getAllUserVerionBoard)
versionRouter.delete('/:id',deleteVersion)