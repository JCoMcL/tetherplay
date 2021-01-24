const spawn = require("child_process").spawn;

function open() {
	return spawn("./stddump", { stdio: ['pipe', 0, 0] } )
}

module.exports.open = open;
