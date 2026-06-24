import { Router } from "express";
import { userMiddleware } from "../middleware/jwt.middleware.js";
import { addElement, createBoard, deleteBoard, getBoard, getMyBoards, joinBoard, updateBoard } from "../controllers/board.controller.js";

const boardrouter = Router()

// boardrouter.use(userMiddleware)
boardrouter.post('/create', createBoard)
boardrouter.get('/get/:Id', getBoard)
boardrouter.get('/myboard', getMyBoards)
boardrouter.patch('/update/:Id', updateBoard)
boardrouter.delete('/delete', deleteBoard)
boardrouter.put('/add/:id', addElement)
boardrouter.post('/join', joinBoard)
export { boardrouter }