const wss = new (require('ws').Server)({port: 40510})

wss.on('connection', function (ws) {
	console.log(__dirname)
	ws.on('message', function (message) {
		console.log(message)
	})
})
