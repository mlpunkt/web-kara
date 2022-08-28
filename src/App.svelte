<script lang="ts">

	import World from "./world.svelte";
	import MenuLeft from "./MenuLeft.svelte";
	import MenuRight from "./MenuRight.svelte";
	import MenuBottom from "./MenuBottom.svelte";

    import {CodeJar} from "@novacbn/svelte-codejar";
	import { srcInEditor, currentLineNumber } from "./interpreter";


	let lineNumber = 1;

	// function handleButtonRunClick() {
	// 	runProgram(src);
	// }

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



	// function highlight(code, syntax) {
	// 	const codeArray = code.split(/\r\n|\r|\n/g);

	// 	const lineBreak = (i) => i < codeArray.length - 1
	// 									? '\n'
	// 									: '';

	// 	const newCode = codeArray.reduce(
	// 		(acc, curr, i ) => i === lineNumber - 1
	// 								? acc + '<span style="background-color:#ddd;">' + curr + '</span>' + lineBreak(i)
	// 								: acc + curr + lineBreak(i),
	// 		''
	// 	);

	// 	return newCode;
	// }
</script>

<main>

	<!-- <button on:click={() => console.log(world_treeFront($world))}>treeFront?</button>
	<button on:click={() => console.log(world_treeLeft($world))}>treeLeft?</button>
	<button on:click={() => console.log(world_treeRight($world))}>treeRight?</button>
	<button on:click={() => console.log(world_karaOnLeaf($world))}>onLeaf?</button> -->

	<br>

	<div style="display: flex;">
		<MenuLeft />
		<World />
		<MenuRight />
	</div>
	<MenuBottom />
	
	<CodeJar spellcheck={false} tab={"    "} bind:value={$srcInEditor} withLineNumbers={true} />
	<br>
	<p>folgende Zeile wird ausgeführt: {$currentLineNumber}</p>
</main>