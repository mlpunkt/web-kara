<script lang="ts">

	import World from "./world.svelte";
	import MenuLeft from "./MenuLeft.svelte";
	import MenuRight from "./MenuRight.svelte";
	import MenuBottom from "./MenuBottom.svelte";

	import MessageDialog from "./dialog/MessageDialog.svelte";
	import ChangeSizeDialog from "./dialog/ChangeSizeDialog.svelte";

	import Output from "./Output.svelte";

	import Editor from './Editor.svelte';
	import { runProgram, interpreterState, InterpreterState } from "./interpreter";
	import { initialSrc } from "./initialSrc";
	import MenuTop from "./MenuTop.svelte";

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

	<MenuTop />
	<div style="display: flex;">
		<MenuLeft />
		<World />
		<MenuRight />
	</div>
	<MenuBottom on:run={handleRun}/>
	
	<br>
	<!-- <p>folgende Zeile wird ausgeführt: {$currentLineNumber}</p> -->
	<!-- <p>
		Interpreter: {$interpreterState}
	</p> -->

	<p>
		{#if $interpreterState === InterpreterState.STOPPED}
			Programm gestoppt
		{/if}
		{#if $interpreterState === InterpreterState.RUNNING}
			Programm läuft
		{/if}
		{#if $interpreterState === InterpreterState.PAUSED}
			Programm pausiert
		{/if}
	</p>

	<Editor bind:this={editor} initialText={initialSrc} />

	<!-- <button on:click={() => editor.setText('test')}>test</button>
	<button on:click={() => editor.highlightLine(1)}>test</button>
	<button on:click={() => editor.highlightLine(2)}>test</button> -->

	<MessageDialog />
	<ChangeSizeDialog />

	<Output />
</main>
