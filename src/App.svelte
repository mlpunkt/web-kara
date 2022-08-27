<script lang="ts">
	import {kara_move, kara_turn_ccw, kara_turn_cw, uiState_setEditMode, world_putLeaf, world_removeLeaf} from './actions';

	import World from "./world.svelte";

    import {CodeJar} from "@novacbn/svelte-codejar";
	import { world_karaOnLeaf, world_treeFront, world_treeLeft, world_treeRight } from './types/world';
	import { world} from './types/world';
	import { EditMode, uiState } from './types/uiState';

	let p;

	let lineNumber = 1;

	const myWorker = new Worker("webworker.js");

	function sendBoolAndOpenLock(resultLockArray: Int32Array, resultArray: Int8Array, value: boolean) {
		if (value) {
			Atomics.store(resultArray, 0, 1);
		} else {
			Atomics.store(resultArray, 0, 0);
		}

		const numberNotified = Atomics.notify(resultLockArray, 0, 1);
		console.log('numberNotified ' + numberNotified);
	}

	myWorker.onmessage = function(message) {
		// console.log('Message in App');
		// console.log(message)

		if (message.data.cmd === 'move') {
			kara_move();
		} else if (message.data.cmd === 'turn_cw') {
			kara_turn_cw();
		} else if (message.data.cmd === 'turn_ccw') {
			kara_turn_ccw();
		} else if(message.data.cmd === 'lineNumber') {
			lineNumber = message.data.lineNumber;
		} else if(message.data.cmd === 'treeFront') {
			const result = world_treeFront($world);
			sendBoolAndOpenLock(resultLockArray, resultArray, result);
			// // console.log('treeFront? ' + result)
			
			// // Ergebnis im gemeinsamen Speicher speichern
			// if (result) {
			// 	Atomics.store(resultArray, 0, 1);
			// } else {
			// 	Atomics.store(resultArray, 0, 0);
			// }

			// // Lock öffnen
			// console.log('Lock öffnen');

			// const numberNotified = Atomics.notify(resultLockArray, 0, 1);
			// console.log('numberNotified ' + numberNotified);
		} else if(message.data.cmd === 'treeRight') {
			const result = world_treeRight($world);
			sendBoolAndOpenLock(resultLockArray, resultArray, result);
			// // console.log('treeFront? ' + result)
			
			// // Ergebnis im gemeinsamen Speicher speichern
			// if (result) {
			// 	Atomics.store(resultArray, 0, 1);
			// } else {
			// 	Atomics.store(resultArray, 0, 0);
			// }

			// // Lock öffnen
			// console.log('Lock öffnen');
			// // Atomics.store(resultLockArray, 0, 0);
			// const numberNotified = Atomics.notify(resultLockArray, 0, 1);
			// console.log('numberNotified ' + numberNotified);
		} else if(message.data.cmd === 'treeLeft') {
			const result = world_treeLeft($world);
			sendBoolAndOpenLock(resultLockArray, resultArray, result);
			// // console.log('treeFront? ' + result)
			
			// // Ergebnis im gemeinsamen Speicher speichern
			// if (result) {
			// 	Atomics.store(resultArray, 0, 1);
			// } else {
			// 	Atomics.store(resultArray, 0, 0);
			// }

			// // Lock öffnen
			// console.log('Lock öffnen');
			// // Atomics.store(resultLockArray, 0, 0);
			// const numberNotified = Atomics.notify(resultLockArray, 0, 1);
			// console.log('numberNotified ' + numberNotified);
		} else if(message.data.cmd === 'onLeaf') {
			const result = world_karaOnLeaf($world);
			sendBoolAndOpenLock(resultLockArray, resultArray, result);

		} else if (message.data.cmd === 'putLeaf') {
			world_putLeaf($world.kara.position);
		} else if (message.data.cmd === 'removeLeaf') {
			world_removeLeaf($world.kara.position);
		}
	}

	const speedBuffer = new SharedArrayBuffer(4);
	const speedArray = new Int32Array(speedBuffer);
	speedArray[0] = 300;

	const exitBuffer = new SharedArrayBuffer(4);
	const exitArray = new Int32Array(exitBuffer);
	exitArray[0] = 0;

	const resultLockBuffer = new SharedArrayBuffer(4);
	const resultLockArray = new Int32Array(resultLockBuffer);

	const resultBuffer = new SharedArrayBuffer(1);
	const resultArray = new Int8Array(resultBuffer);

	function handleButtonRunClick() {
		exitArray[0] = 0;
		myWorker.postMessage({
			type: 'run',
			speedBuffer: speedBuffer,
			exitBuffer: exitBuffer,
			resultLockBuffer: resultLockBuffer,
			resultBuffer: resultBuffer,
			pythonSrc: src,
		});
	}

	function handleButtonFastClick() {
		speedArray[0] = 300;
	}

	function handleButtonSlowClick() {
		speedArray[0] = 2000;
	}

	function handleButtonExitClick() {
		exitArray[0] = 1;
	}

	let src = `import kara
while True:
    while not kara.treeFront():
        kara.move()
    kara.turnRight()
    kara.move()
    kara.turnLeft()
    kara.move()
    kara.move()
    kara.turnLeft()
    kara.move()
    kara.turnRight()
`

	function handleTreeClick() {
		uiState_setEditMode(EditMode.TREE);
	}

	function handleKaraClick() {
		uiState_setEditMode(EditMode.KARA);
	}

	function handleLeafClick() {
		uiState_setEditMode(EditMode.LEAF);
	}
</script>

<main>
	<button on:click={handleButtonRunClick}>run</button>
	<button on:click={handleButtonFastClick}>schnell</button>
	<button on:click={handleButtonSlowClick}>langsam</button>
	<button on:click={handleButtonExitClick}>Programm abbrechen</button>
	<button on:click={() => kara_move()}>move</button>
	<button on:click={() => kara_turn_cw()}>drehe CW</button>
	<button on:click={() => kara_turn_ccw()}>drehe CCW</button>
	<button on:click={() => console.log(world_treeFront($world))}>treeFront?</button>
	<button on:click={() => console.log(world_treeLeft($world))}>treeLeft?</button>
	<button on:click={() => console.log(world_treeRight($world))}>treeRight?</button>
	<button on:click={() => console.log(world_karaOnLeaf($world))}>onLeaf?</button>
	<button on:click={handleTreeClick} class:highlightButton={$uiState.editMode === EditMode.TREE}>Baum setzen/löschen</button>
	<button on:click={handleLeafClick} class:highlightButton={$uiState.editMode === EditMode.LEAF}>Blatt setzen/löschen</button>
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