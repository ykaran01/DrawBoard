import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()
app.use(cors({
  origin: "http://localhost:5173",
  credentials:true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("Public"))

import { user } from './router/user.router.js'
import { boardrouter } from './router/board.router.js'
import { messageRouter } from './router/messages.route.js'

app.use('/api/user',user)
app.use('/api/board',boardrouter)
app.use('/api/message',messageRouter)

export {app}