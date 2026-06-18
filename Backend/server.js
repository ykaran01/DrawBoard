import http from 'http'
import { Server } from 'socket.io'
import { app } from './src/app.js'
import { socketserver } from './src/websockets/index.js'
import dotenv from 'dotenv'
dotenv.config()
const server = http.createServer(app)
socketserver(server)
server.listen(process.env.PORT||5000, () => {
  console.log("server is running")
})