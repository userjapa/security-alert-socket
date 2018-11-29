//const socket = io.connect('/arduino')
const socket = io.connect(`${window.location.host}/arduino`)
let checkBtn = document.getElementById('check'),
    resultTxt = document.getElementById('result')

let arduino_connected = false

let ledState = false

const changeLedState = isOn => {
  ledState = isOn
  if (isOn) checkBtn.textContent = 'Turn led:off'
  else checkBtn.textContent = 'Turn led:on'
}

// SOCKET START
socket.on('connect', () => {
  console.log(`Client ${socket.id} connected!`)
})

socket.on('led:on', () => {
  changeLedState(true)
})

socket.on('led:off', () => {
  changeLedState(false)
})
// SOCKET END

// DOM START
checkBtn.onclick = () => {
  if (!ledState) socket.emit('led:on')
  else socket.emit('led:off')
  // resultTxt.textContent = ''
  // socket.emit('request_verification')
}
// DOM END
