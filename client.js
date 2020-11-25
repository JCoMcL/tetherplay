var ws = new WebSocket('ws://localhost:40510');

ws.onopen = function () { ws.send('connected') }
ws.onmessage = function (ev) { console.log(ev); }

function send(s) {
	ws.send(s);
}

