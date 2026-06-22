import http from 'http'
import { Server } from 'socket.io'
import { app } from './src/app.js'
import { socketserver } from './src/websockets/index.js'
import dotenv from 'dotenv'
import { connectDB } from './src/config/database.config.js'
dotenv.config()
const server = http.createServer(app)
socketserver(server)
connectDB()
server.listen(process.env.PORT||5000, () => {
  console.log("server is running")
})