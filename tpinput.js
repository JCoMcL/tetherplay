const spawn = require("child_process").spawn;

function open() {
	controller = spawn("../tetherplay-input/tpinput");
	controller.stderr.setEncoding('ascii')
	controller.stderr.on('data', (data) => process.stdout.write(data))

	return controller
}

module.exports.open = open;
