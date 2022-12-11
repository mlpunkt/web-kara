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
	import { initialSrcDefault } from "./initialSrc";
	import MenuTop from "./MenuTop.svelte";
	import MenuEditor from "./MenuEditor.svelte";
	import {world} from './types/world';

	import {saveSrcOnStart, saveWorldOnStart, srcFilename, worldFilename} from './stores';
	import SaveFileAsDialog from "./dialog/SaveFileAsDialog.svelte";
	import LoadFileDialog from "./dialog/LoadFileDialog.svelte";
    import type { Exercise } from "./Exercise";


	let editor: Editor;

	export let exercise: Exercise;
	if (exercise) {
		world.set(exercise.worlds[0]);
	}

	// const initialSrc = typeof exercise.initialSrc === 'string'
	// 					? exercise.initialSrc
	// 					: initialSrcDefault;

	const initialSrc = exercise?.initialSrc ?? initialSrcDefault;


	function saveSrc(src: string) {
		const link = document.createElement('a');
		link.download = $srcFilename + '.py'
        link.href = ('data:text/plain;charset=utf-8,') + encodeURIComponent(src);
        link.click();		
	}

	function saveWorld() {
		var link = document.createElement('a');
        link.download = $worldFilename + '.world'
        link.href = ('data:text/plain;charset=utf-8,') + JSON.stringify($world);
        link.click();
	}

	function handleEditorSave() {
		const src = editor.getText();
		saveSrc(src);
	}

	function handleEditorLoad(evt) {		
		editor.setText(evt.detail.text);
	}

	function handleWorldSave() {
		saveWorld();
	}

	function handleRun(event) {
		const src = editor.getText();

		if ($saveSrcOnStart) {
			saveSrc(src);
		}

		if ($saveWorldOnStart) {
			saveWorld()
		}

		const breakpoints = editor.getBreakpoints();
		runProgram(src, breakpoints);
	}

	let worldComponent;
	function handleScreenshot() {
		if (worldComponent) {
			var link = document.createElement('a');
			link.download = 'kara-screenshot.svg'
			// link.href = ('data:text/plain;charset=utf-8,') + worldComponent.getSvgString();
			link.href = ('data:image/svg+xml;charset=utf-8,') + worldComponent.getSvgString();
			link.click();
		}
	}
</script>

<main>
	<div style="display: flex; height: 100vh">
		<div style="display: flex; flex-direction: column; margin-right: 3em;">
			<MenuTop 
				on:save={handleWorldSave}
				on:screenshot={handleScreenshot} />
			<div style="display: flex;">
				<MenuLeft />
				<World bind:this={worldComponent}/>
				<MenuRight />
			</div>
			<MenuBottom on:run={handleRun}/>
			<Output />
		</div>

		<div style="display: flex; flex-direction: column; align-items: stretch; flex-grow: 1">
		<!-- <div> -->
			<MenuEditor on:save={handleEditorSave} on:load={handleEditorLoad}/>
			<Editor bind:this={editor} initialText={initialSrc} />
			<!-- <VariableInspector /> -->
		</div>
	</div>

	<MessageDialog />
	<ChangeSizeDialog />
	<SaveFileAsDialog />
	<LoadFileDialog />
</main>
