<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    import {saveSrcOnStart, srcFilename} from './types/save';

    // let filename = 'quellcode';

    function handleButtonSaveClick() {
        dispatch('save');
    }

    function handleFileUpload(evt) {
        let file = evt.target.files[0];

        srcFilename.set(file.name.split('.')[0]);

        let fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = e => { 
            const contentString = <string>fileReader.result;
            dispatch('load', {text: contentString});
        }

        evt.target.value = '';
    }
</script>

<div>
    <button on:click={handleButtonSaveClick}>speichern</button>
    <span>Dateiname: </span> <input bind:value={$srcFilename}> <span>.py</span>
    <br>
    speichern bei jedem Programmstart: <input type=checkbox bind:checked={$saveSrcOnStart}>
    <br>
    laden: 
    <input type="file" id="input" on:input={handleFileUpload}>
</div>