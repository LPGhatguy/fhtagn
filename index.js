"use strict";

const SHOW_PROGRAM = false;
const SHOW_CYCLE_BREAKDOWN = false;
const SHOW_SUBCYCLE_BREAKDOWN = false;
const STOP_ON_CYCLE = -1;

function step(program, state) {
	let sub = 0;
	for (const [pattern, replacement] of program) {
		state = state.replace(pattern, replacement);

		sub++;

		if (SHOW_SUBCYCLE_BREAKDOWN) {
			console.log("\t Sub-cycle " + sub + ": " + JSON.stringify(state));
		}
	}

	return state;
}

function escape(str) {
	return str.trim()
		.replace(/\\n/g, "\n")
		.replace(/\\(\d{1,3})/g, (whole, piece) => {
			return String.fromCharCode(parseInt(piece));
		});
}

function parse(source) {
	const program = [];
	source = source
		.replace(/^#.*/g, "")
		.replace(/\n#.*/g, "\n");
	const items = source.split("\\\\");

	for (let i = 0; i < items.length; i += 2) {
		if (i >= items.length - 1) {
			break;
		}

		const entry = [
			new RegExp(escape(items[i])),
			escape(items[i + 1])
		];

		program.push(entry);

		if (SHOW_PROGRAM) {
			console.log(...entry);
		}
	}

	if (SHOW_PROGRAM) {
		console.log("Program has " + program.length + " instructions.");
	}

	window.__PROGRAM = program;

	return program;
}

function schedule(fn) {
	setTimeout(fn, 50);
}

function run(program, state="") {
	return new Promise((resolve, reject) => {
		const info = {
			cycles: 0,
			output: ""
		};

		const frame = () => {
			state = step(program, state);

			++info.cycles;

			if (SHOW_CYCLE_BREAKDOWN) {
				console.log("Cycle " + info.cycles + ": " + JSON.stringify(state));
			}

			if (STOP_ON_CYCLE > 0 && info.cycles == STOP_ON_CYCLE) {
				return;
			}

			if (state.charCodeAt(0) == 0) {
				info.output = state.substring(1);
				resolve(info);
			} else {
				schedule(frame);
			}
		};

		frame();
	});
}

fetch("./examples/hello-world.fht")
	.then(res => res.text())
	.then(parse)
	.then(run)
	.then(info => {
		console.log("Program completed after", info.cycles, "cycles");
		console.log("Output:\n" + info.output);
	});