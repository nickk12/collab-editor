import { Server } from '@hocuspocus/server'

const server = Server.configure({
  port: 80,
    
})
console.log("connect?")
server.listen()
