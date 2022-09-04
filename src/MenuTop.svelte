<script lang="ts">
    import {world, worldBeforeLastRun} from './types/world';
    import { tooltip } from './tooltip';
    import iconWorldBeforeRun from '../assets/iconWorldBeforeRun_normal.svg';
    import { world_set } from './actions';
    import {saveWorldOnStart} from './types/save';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    import {worldFilename} from './types/save';

    function handleButtonSaveClick() {
        dispatch('save');
        // var link = document.createElement('a');
        // // link.download = 'circuit.json';
        // link.download = filename + '.world'
        // link.href = ('data:text/plain;charset=utf-8,') + JSON.stringify($world);
        // link.click();
    }

    function handleResetWorldClick() {
        $world = $worldBeforeLastRun;
    }

    function handleFileUpload(evt) {
        let file = evt.target.files[0];
        worldFilename.set(file.name.split('.')[0]);

        let fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = e => { 
            const contentString = <string>fileReader.result;
            const newWorld = JSON.parse(contentString);
            world_set(newWorld);            
        }

        evt.target.value = '';
    }
    
</script>


<div style="padding: 0.5em; display: flex">
    <button
        title="Welt zurücksetzen auf Zustand vor der letzen Programmausführung"
        use:tooltip
        class="iconButton"
        on:click={handleResetWorldClick}
        >
        <img
            style="pointer-events: none;"
            height="30px"
            src={iconWorldBeforeRun}
            alt="Icon Welt zurücksetzen auf Zustand vor der letzen Programmausführung"
        />
    </button>
    <div style="margin-left: 1em">
        <button on:click={handleButtonSaveClick}>speichern</button>
        <span>Dateiname: </span> <input bind:value={$worldFilename}> <span>.world</span>
        <br>
        speichern bei jedem Programmstart: <input type=checkbox bind:checked={$saveWorldOnStart}>
        <br>
        <span>laden: </span>
        <input type="file" id="input" on:input={handleFileUpload}>
    </div>
</div>