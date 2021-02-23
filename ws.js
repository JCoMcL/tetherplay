const wss = new (require('ws').Server)({port: 40510})
const tpinput = require('./tpinput')

wss.on('connection', function (ws) {
	controller = tpinput.open()
	ws.on('message', function (message) {
		controller.stdin.write(message + '\n')
	})
})
