<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    import {saveSrcOnStart, srcFilename} from './stores';
    import iconSave from   '../assets/save.svg'
    import iconSaveAs from '../assets/saveAs.svg';
    import iconLoad from   '../assets/load.svg';
    import { tooltip } from './tooltip';
    import { dialog_openLoadFileDialog, dialog_openSaveFileAsDialog } from './actions';

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

    function handleButtonSpeichernClick() {
        dispatch('save');
    }

    function handleButtonSpeichernAlsClick() {
        dialog_openSaveFileAsDialog(
            (filename) => {
                $srcFilename = filename;
                dispatch('save');
            },
            $srcFilename,
            'py',
        );
    }

    function handleButtonLoadClick() {
        dialog_openLoadFileDialog(
            (filename: string, content: string) => {
                srcFilename.set(filename);
                dispatch('load', {text: content});
            }
        )
    }
</script>

<div class="panel">
    <button
        class="iconButton"
        title="Programm speichern"
        use:tooltip
        on:click={handleButtonSpeichernClick}
    >
        <img
            style="pointer-events: none;"
            height="30px"
            src={iconSave}
            alt="icon speichern"
        />
    </button>

    <button
        class="iconButton"
        title="Programm speichern als"
        use:tooltip        
        on:click={handleButtonSpeichernAlsClick}
    >
        <img
            style="pointer-events: none;"
            height="30px"
            src={iconSaveAs}
            alt="icon speichern als"
        />
    </button>
    <button
        class="iconButton"
        title="Programm laden"
        use:tooltip        
        on:click={handleButtonLoadClick}
    >
        <img
            style="pointer-events: none;"
            height="30px"
            src={iconLoad}
            alt="icon speichern als"
        />
    </button>

<!--     
    <button on:click={handleButtonSaveClick}>speichern</button>
    <span>Dateiname: </span> <input bind:value={$srcFilename}> <span>.py</span>
    <br>
    speichern bei jedem Programmstart: <input type=checkbox bind:checked={$saveSrcOnStart}>
    <br>
    laden: 
    <input type="file" id="input" on:input={handleFileUpload}> -->
</div>