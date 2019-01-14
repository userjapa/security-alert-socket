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

let outputs = {
  led13: false
}

io.on('connection', socket => {
  console.log(`Socket ${socket.id} connected!`)

  socket.on('disconnect', () => {
    console.log(`Socket ID:${socket.id} Disconnected...`)
    io.emit('set-outputs', outputs)
  })

  socket.on('led:on', () => {
    io.emit('led:on')
    outputs['led13'] = true
  })

  socket.on('led:off', () => {
    io.emit('led:off')
    outputs['led13'] = false
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
