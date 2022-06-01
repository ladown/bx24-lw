const exec = require('child_process').exec;

class HookPlugin {
	constructor(name, command, stage = 'afterEmit') {
		this.name = name;
		this.command = command;
		this.stage = stage;
	}

	static execHandler(err, stdout, stderr) {
		if (stdout) process.stdout.write(stdout);
		if (stderr) process.stderr.write(stderr);
	}

	apply(compiler) {
		compiler.hooks[this.stage].tapAsync(this.name, (params, callback) => {
			// exec(this.command, callback);
			exec(this.command, HookPlugin.execHandler);
			callback();
		});
	}
}

module.exports = HookPlugin;
