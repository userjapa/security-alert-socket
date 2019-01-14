//const socket = io.connect('/arduino')
const socket = io.connect(`${window.location.origin}/arduino`)
let checkBtn = document.getElementById('check'),
    resultTxt = document.getElementById('result')

let arduino_connected = false

let outputs = {
  led13: false
}

const changeLedState = isOn => {
  outputs['led13'] = isOn
  if (isOn) checkBtn.textContent = 'Turn led:off'
  else checkBtn.textContent = 'Turn led:on'
}

// SOCKET START
socket.on('connect', () => {
  console.log(`Client ${socket.id} connected!`)
})

socket.on('set-outputs', data => {
  changeLedState(data['led13'])
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
  if (!outputs['led13']) socket.emit('led:on')
  else socket.emit('led:off')
  // resultTxt.textContent = ''
  // socket.emit('request_verification')
}
// DOM END
