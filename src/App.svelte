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

	function handleEditorSave(event) {
		const src = editor.getText();

		const link = document.createElement('a');
		link.download = event.detail.filename + '.py'
        link.href = ('data:text/plain;charset=utf-8,') + encodeURIComponent(src);
        link.click();
	}

	function handleEditorLoad(evt) {
		editor.setText(evt.detail.text);
	}

	function handleRun() {
		const src = editor.getText();
		const breakpoints = editor.getBreakpoints();
		runProgram(src, breakpoints);
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
			<MenuEditor on:save={handleEditorSave} on:load={handleEditorLoad}/>
			<Editor bind:this={editor} initialText={initialSrc} />			
		</div>
	</div>

	<MessageDialog />
	<ChangeSizeDialog />
</main>
