const spawn = require("child_process").spawn;

<<<<<<< HEAD
function open(config) {
	var executable = config.sink ? config.sink : 'tpinput'
	controller = spawn(executable);
=======
function open() {
	controller = spawn("../input/tpinput");
>>>>>>> 3b07659 (add qrcode, rebased multi-user, change config for 4 gp buttons)
	controller.stderr.setEncoding('ascii')
	controller.stderr.on('data', (data) => process.stdout.write(data))

	return controller
}

module.exports.open = open;
