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

let connection = {
  arduino: false,
  client: false
}

let id = {}

io.on('connection', socket => {
  // socket.emit('news', { hello: 'world' })
  socket.on('client_connected', () => {
    connection['client'] = true
    id[socket.id] = 'client'
    socket.emit('arduino_connection', connection['arduino'])
    socket.emit('client_connection', connection['client'])
    console.log('Client connected');
  })

  socket.on('arduino_connected', () => {
    connection['arduino'] = true
    id[socket.id] = 'arduino'
    socket.emit('client_connection', connection['client'])
    socket.emit('arduino_connection', connection['arduino'])
  })

  socket.on('disconnect', () => {
    const type = id[socket.id]
    connection[type] = false
    delete id[socket.id]
    socket.emit(`${type}_connection`, connection[type])
  })

  socket.on('request_verification', () => {
    socket.emit('verification_requested')
  })

  socket.on('verification_made', data => {
    socket.emit('verification_result', data)
  })

})

server.listen(PORT, () => console.log(`Listening at port ${PORT}`))
