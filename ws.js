function start(config) {
	const wss = new (require('ws').Server)({port: 40510})
	const tpinput = require('./tpinput')

	function bind_controller(websocket) {
		websocket.controller = tpinput.open(config)
		websocket.controller.on('close', (code, sig) => {
			if (!sig) {
				console.error(`${ws.id}: Controller closed unexpectedly, restarting`)
				bind_controller(websocket)
			}
		})
	}

	wss.on('connection', (ws, req) => {
		ws.id = req.socket.remoteAddress
		console.log(`new connection: ${ws.id}`)

		bind_controller(ws)

		ws.on('message', message => {
			ws.controller.stdin.write(message + '\n')
		})
		ws.on('close', (code, reason) => {
			if (!reason)
				reason = "unknown reason"
			console.error(`${ws.id}: Connection closed: ${reason}`)
			ws.controller.kill()
		})
	})
}

module.exports.start = start;
