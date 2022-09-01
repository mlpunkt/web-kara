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
	import MenuEditor from "./MenuEditor.svelte";

	let editor: Editor;

	function handleRun() {
		const src = editor.getText();
		runProgram(src);
	}
</script>

<main>
	<div style="display: flex; height: 100vh">
		<div style="display: flex; flex-direction: column; margin-right: 3em;">
			<MenuTop />
			<div style="display: flex;">
				<MenuLeft />
				<World />
				<MenuRight />
			</div>
			<MenuBottom on:run={handleRun}/>
			<Output />
		</div>

		<div style="display: flex; flex-direction: column; align-items: stretch; flex-grow: 1">
		<!-- <div> -->
			<MenuEditor />
			<Editor bind:this={editor} initialText={initialSrc} />			
		</div>
	</div>

	<MessageDialog />
	<ChangeSizeDialog />
</main>
