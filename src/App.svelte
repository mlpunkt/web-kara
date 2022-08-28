<script lang="ts">
	import {kara_move, kara_turnLeft, kara_turnRight, uiState_setEditMode, world_putLeaf, world_removeLeaf} from './actions';

	import World from "./world.svelte";

    import {CodeJar} from "@novacbn/svelte-codejar";
	import { world_karaOnLeaf, world_mushroomFront, world_treeFront, world_treeLeft, world_treeRight } from './types/world';
	import { world} from './types/world';
	import { EditMode, uiState } from './types/uiState';

	let lineNumber = 1;

	Sk.builtins.__move__ = new Sk.builtin.func(function () {
		kara_move();
	});

	Sk.builtins.__turnRight__ = new Sk.builtin.func(function () {
		kara_turnRight();
	});

	Sk.builtins.__turnLeft__ = new Sk.builtin.func(function () {
		kara_turnLeft();
	});


	Sk.builtins.__putLeaf__ = new Sk.builtin.func(function () {
		world_putLeaf($world.kara.position);
	});
	
	Sk.builtins.__removeLeaf__ = new Sk.builtin.func(function () {
		world_removeLeaf($world.kara.position);
	});

	Sk.builtins.__treeFront__ = new Sk.builtin.func(function () {
		return world_treeFront($world);
	});

	Sk.builtins.__treeLeft__ = new Sk.builtin.func(function () {
		return world_treeLeft($world);
	});

	Sk.builtins.__treeRight__ = new Sk.builtin.func(function () {
		return world_treeRight($world);
	});

	Sk.builtins.__onLeaf__ = new Sk.builtin.func(function () {
		return world_karaOnLeaf($world);
	});

	Sk.builtins.__mushroomFront__ = new Sk.builtin.func(function () {
		return world_mushroomFront($world);
	});

	let sleepTime = 1;

	Sk.builtins.__st__ = new Sk.builtin.func(function () {
		return sleepTime;
	});


	// const myWorker = new Worker("webworker.js");

	// function sendBoolAndOpenLock(resultLockArray: Int32Array, resultArray: Int8Array, value: boolean) {
	// 	if (value) {
	// 		Atomics.store(resultArray, 0, 1);
	// 	} else {
	// 		Atomics.store(resultArray, 0, 0);
	// 	}

	// 	const numberNotified = Atomics.notify(resultLockArray, 0, 1);
	// 	console.log('numberNotified ' + numberNotified);
	// }

	// myWorker.onmessage = function(message) {
	// 	// console.log('Message in App');
	// 	// console.log(message)

	// 	if (message.data.cmd === 'move') {
	// 		kara_move();
	// 	} else if (message.data.cmd === 'turn_cw') {
	// 		kara_turn_cw();
	// 	} else if (message.data.cmd === 'turn_ccw') {
	// 		kara_turn_ccw();
	// 	} else if(message.data.cmd === 'lineNumber') {
	// 		lineNumber = message.data.lineNumber;
	// 	} else if(message.data.cmd === 'treeFront') {
	// 		const result = world_treeFront($world);
	// 		sendBoolAndOpenLock(resultLockArray, resultArray, result);		
	// 	} else if(message.data.cmd === 'treeRight') {
	// 		const result = world_treeRight($world);
	// 		sendBoolAndOpenLock(resultLockArray, resultArray, result);
	// 	} else if(message.data.cmd === 'treeLeft') {
	// 		const result = world_treeLeft($world);
	// 		sendBoolAndOpenLock(resultLockArray, resultArray, result);
	// 	} else if(message.data.cmd === 'onLeaf') {
	// 		const result = world_karaOnLeaf($world);
	// 		sendBoolAndOpenLock(resultLockArray, resultArray, result);
	// 	} else if (message.data.cmd === 'putLeaf') {
	// 		world_putLeaf($world.kara.position);
	// 	} else if (message.data.cmd === 'removeLeaf') {
	// 		world_removeLeaf($world.kara.position);
	// 	}
	// }

	// const speedBuffer = new SharedArrayBuffer(4);
	// const speedArray = new Int32Array(speedBuffer);
	// speedArray[0] = 300;

	// const exitBuffer = new SharedArrayBuffer(4);
	// const exitArray = new Int32Array(exitBuffer);
	// exitArray[0] = 0;

	// const resultLockBuffer = new SharedArrayBuffer(4);
	// const resultLockArray = new Int32Array(resultLockBuffer);

	// const resultBuffer = new SharedArrayBuffer(1);
	// const resultArray = new Int8Array(resultBuffer);

	function outf(text) { 
		console.log(text);
	}


	const srcBase=`
import time

class Kara:
    def move(self):
        __move__()
        time.sleep(__st__())

    def turnLeft(self):
        __turnLeft__()
        time.sleep(__st__())

    def turnRight(self):
        __turnRight__()
        time.sleep(__st__())

    def putLeaf(self):
        __putLeaf__()
        time.sleep(__st__())

    def removeLeaf(self):
        __removeLeaf__()
        time.sleep(__st__())

    def treeFront(self):
        return __treeFront__()

    def treeLeft(self):
        return __treeLeft__()

    def treeRight(self):
        return __treeRight__()

    def onLeaf(self):
        return __onLeaf__()

    def mushroomFront(self):
        return __mushroomFront__()

kara = Kara()
`;

	function handleButtonRunClick() {
		exit = false;
		const asyncFunc = async function() {
			Sk.configure({
				output:outf,
				debugging: true,
				retainGlobals: true,
			});

			let test = Sk.importMainWithBody("base", false, srcBase, true);
			while (test.$isSuspension && !exit) {
				if (test.data.type === 'Sk.promise') {
					await test.data.promise;
				}
				test = test.resume();
			}

			test = Sk.importMainWithBody("userSrc", false, src, true);
			while (test.$isSuspension && !exit) {
				if (test.child.$filename === "userSrc.py") {
					lineNumber = test.child.$lineno;
				}
				if (test.data.type === 'Sk.promise') {
					await test.data.promise;
				}
				test = test.resume();
			}

		}

		asyncFunc()
			.then(() => console.log('fertig'))
			.catch((e) => console.log(e));
	}

	// evtl. alternative Funktion zum Starten eines Programms:
	// function handleButtonRunClick() {
	// 	var myPromise = Sk.misceval.asyncToPromise(function() {
	// 		return Sk.importMainWithBody("<stdin>", false, src, true);
	// 	});

	// 	myPromise.then(function(mod) {
	// 		console.log('success');
	// 	},
	// 		function(err) {
	// 		console.log(err.toString());
	// 	});
	// }

	function handleButtonFastClick() {
		sleepTime = 0.3
	}

	function handleButtonSlowClick() {
		sleepTime = 1.5
	}

	let exit = false;
	function handleButtonExitClick() {
		exit = true;
	}

// 	let src=`kara.move()
// kara.turnLeft()
// kara.move()
// kara.turnRight()
// kara.move()`

// let src = `
// while True:
//     while not kara.treeFront():
//         kara.move()
//     kara.turnRight()
//     kara.move()
//     kara.turnLeft()
//     kara.move()
//     kara.move()
//     kara.turnLeft()
//     kara.move()
//     kara.turnRight()
// `

// let src=`
// while kara.treeRight():
//     kara.move()
// while kara.treeLeft():
//     kara.move()`


let src=`
while True:
    if kara.onLeaf():
        kara.removeLeaf()
    else:
        kara.putLeaf()
    kara.move()`

// 	let src=`import time
// move()
// time.sleep(1)
// move()
//`

	function handleTreeClick() {
		uiState_setEditMode(EditMode.TREE);
	}

	function handleKaraClick() {
		uiState_setEditMode(EditMode.KARA);
	}

	function handleLeafClick() {
		uiState_setEditMode(EditMode.LEAF);
	}

	function handleMushroomClick() {
		uiState_setEditMode(EditMode.MUSHROOM);
	}
</script>

<main>
	<button on:click={handleButtonRunClick}>run</button>
	<button on:click={handleButtonFastClick}>schnell</button>
	<button on:click={handleButtonSlowClick}>langsam</button>
	<button on:click={handleButtonExitClick}>Programm abbrechen</button>
	<button on:click={() => kara_move()}>move</button>
	<button on:click={() => kara_turnRight()}>drehe CW</button>
	<button on:click={() => kara_turnLeft()}>drehe CCW</button>
	<button on:click={() => console.log(world_treeFront($world))}>treeFront?</button>
	<button on:click={() => console.log(world_treeLeft($world))}>treeLeft?</button>
	<button on:click={() => console.log(world_treeRight($world))}>treeRight?</button>
	<button on:click={() => console.log(world_karaOnLeaf($world))}>onLeaf?</button>
	<button on:click={handleTreeClick} class:highlightButton={$uiState.editMode === EditMode.TREE}>Baum setzen/löschen</button>
	<button on:click={handleLeafClick} class:highlightButton={$uiState.editMode === EditMode.LEAF}>Blatt setzen/löschen</button>
	<button on:click={handleMushroomClick} class:highlightButton={$uiState.editMode === EditMode.MUSHROOM}>Pilz setzen/löschen</button>
	<button on:click={handleKaraClick} class:highlightButton={$uiState.editMode === EditMode.KARA}>Kara setzen</button>
	<br>
	<World />

	<CodeJar  spellcheck={false} tab={"    "} bind:value={src} />
	<br>
	<p>folgende Zeile wird ausgeführt: {lineNumber}</p>
</main>

<style>
	.highlightButton {
		background-color: aqua;
	}
</style>