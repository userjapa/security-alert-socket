const http = require('http')
const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')

const PORT = process.env.PORT || 5000

const app = express()

app.use(serveStatic(path.join(__dirname, 'static')))
app.use(serveStatic(path.join(__dirname, 'node_modules/socket.io-client/dist')))

const server = http.Server(app)
const socket = require('socket.io')(server)
const io = socket.of('/arduino')

io.on('connection', socket => {

  socket.on('disconnect', () => {
    console.log(`Socket ID:${socket.id} Disconnected...`)
  })

  socket.on('led:on', () => {
    socket.broadcast.emit('led:on')
    console.log('Broadicasting led:on')
  })

  socket.on('led:off', () => {
    socket.broadcast.emit('led:off')
    console.log('Broadicasting led:off')
  })
  // socket.on('request_verification', () => {
  //   socket.emit('verification_requested')
  // })
  //
  // socket.on('verification_made', data => {
  //   socket.emit('verification_result', data)
  // })

})

server.listen(PORT, () => console.log(`Listening at port ${PORT}`))
