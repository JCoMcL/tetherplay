const spawn = require("child_process").spawn;

function open() {
	controller = spawn("./stddump");
	[controller.stdout, controller.stderr].forEach(stream => {
		stream.setEncoding('utf8')
		stream.on('data', (chunk) => process.stdout.write(chunk))
	});

	return process
}

module.exports.open = open;
