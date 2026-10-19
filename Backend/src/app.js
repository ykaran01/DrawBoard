import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()
app.use(cors({
  origin: "https://draw-board-92ae.vercel.app",
  credentials:true
}))
app.use(cookieParser())
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({
    extended: true,
    limit: "10mb"
}));
app.use(express.static("Public"))

import { user } from './router/user.router.js'
import { boardrouter } from './router/board.router.js'
import { messageRouter } from './router/messages.route.js'
import {versionRouter} from './router/version.router.js'

app.use('/api/user',user)
app.use('/api/board',boardrouter)
app.use('/api/message',messageRouter)
app.use('/api/version',versionRouter)

export {app}