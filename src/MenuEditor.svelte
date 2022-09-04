<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
    let filename = 'quellcode';

    function handleButtonSaveClick() {
        console.log(filename)
        dispatch('save', {filename: filename});
    }

    function handleFileUpload(evt) {
        let file = evt.target.files[0];

        filename = file.name.split('.')[0];

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
    <span>Dateiname: </span> <input bind:value={filename}> <span>.py</span>
    <br>
    laden: 
    <input type="file" id="input" on:input={handleFileUpload}>
</div>