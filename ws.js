var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({port: 40510})

var rs = require('./redshift')

wss.on('connection', function (ws) {
	ws.on('message', function (message) {
		ws.send(rs.set(message));
	})
})
