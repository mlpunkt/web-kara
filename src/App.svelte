<script lang="ts">

	import World from "./world.svelte";
	import MenuLeft from "./MenuLeft.svelte";
	import MenuRight from "./MenuRight.svelte";
	import MenuBottom from "./MenuBottom.svelte";

	import Editor from './Editor.svelte';
	import { currentLineNumber, runProgram } from "./interpreter";
	import { initialSrc } from "./initialSrc";

	let editor: Editor;

	function handleRun() {
		const src = editor.getText();
		runProgram(src);
	}


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
	<MenuBottom on:run={handleRun}/>
	
	<br>
	<p>folgende Zeile wird ausgeführt: {$currentLineNumber}</p>

	<Editor bind:this={editor} initialText={initialSrc} />

	<!-- <button on:click={() => editor.setText('test')}>test</button>
	<button on:click={() => editor.highlightLine(1)}>test</button>
	<button on:click={() => editor.highlightLine(2)}>test</button> -->
</main>