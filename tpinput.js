const spawn = require("child_process").spawn;

function open() {
	process = spawn("./stddump");
	[process.stdout, process.stderr].forEach(stream => {
		stream.setEncoding('utf8')
		stream.on('data', (chunk) => console.log(chunk))
	});

	return process
}

module.exports.open = open;
