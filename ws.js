const wss = new (require('ws').Server)({port: 40510})

const rs = require('./redshift')

wss.on('connection', function (ws) {
	console.log("new connection")
	ws.on('message', function (message) {
		ws.send(rs.set(message));
	})
})
