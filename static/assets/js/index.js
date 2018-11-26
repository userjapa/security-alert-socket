const socket = io.connect('/arduino')
let checkBtn = document.getElementById('check'),
    resultTxt = document.getElementById('result')

let arduino_connected = false

// SOCKET START
socket.on('connect', () => {
  socket.emit('client_connected')
})

socket.on('arduino_connection', connection => {
  arduino_connected = connection
  checkBtn.disabled = !arduino_connected
  console.log(arduino_connected);
})

socket.on('verification_result', data => {
  console.log(data)
})
// SOCKET END

// DOM START
checkBtn.onclick = () => {
  resultTxt.textContent = ''
  socket.emit('request_verification')
}
// DOM END
