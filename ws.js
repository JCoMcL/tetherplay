function start(config) {
	const wss = new (require('ws').Server)({port: 40510})
	const tpinput = require('./tpinput')

	wss.on('connection', (ws, req) => {
		console.log(`new connection: ${req.socket.remoteAddress}`)
		ws.controller = tpinput.open(config)
		ws.controller.on('close', (code, sig) => ws.close(1011) )
		ws.on('message', message => {
			ws.controller.stdin.write(message + '\n')
		})
	})
}

module.exports.start = start;
