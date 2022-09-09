<script lang="ts">
    import {world, worldBeforeLastRun} from './types/world';
    import { tooltip } from './tooltip';
    import iconWorldBeforeRun from '../assets/iconWorldBeforeRun_normal.svg';
    import { dialog_openChangeSizeDialog, dialog_openLoadFileDialog, dialog_openSaveFileAsDialog, world_set } from './actions';
    import { worldHeight } from './types/world';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    import {worldFilename} from './stores';
    import iconSave from   '../assets/save.svg'
    import iconSaveAs from '../assets/saveAs.svg';
    import iconLoad from   '../assets/load.svg';
    import iconSetSize from '../assets/iconSetSize_nromal.svg';


    function handleChangeSizeClick() {
        dialog_openChangeSizeDialog();
    }

    function handleButtonSaveClick() {
        dispatch('save');
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
    
    function handleButtonSpeichernClick() {
        dispatch('save');
    }

    function handleButtonSpeichernAlsClick() {
        dialog_openSaveFileAsDialog(
            (filename) => {
                $worldFilename = filename;
                dispatch('save');
            },
            $worldFilename,
            'world',
        );
    }

    function handleButtonLoadClick() {
        dialog_openLoadFileDialog(
            (filename: string, content: string) => {
                worldFilename.set(filename);
                const newWorld = JSON.parse(content);
                world_set(newWorld);
            }
        );
    }
</script>

<div>
    <div class="panel" style="display: flex">
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

        <span style="margin-left: 0.5em"></span>

        <button
            class="iconButton"
            title="Welt speichern"
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
            title="Welt speichern als"
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
            title="Welt laden"
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

        <span style="margin-left: 0.5em"></span>

        <div>
            Zoom: <br>
            <input type="range" min="200" max="600" step="10" bind:value={$worldHeight} class="slider">    
        </div>
        
        <span style="margin-left: 0.5em"></span>

        <button
            title="Anzahl der Felder in der Welt ändern"
            use:tooltip
            class="iconButton"
            on:click={handleChangeSizeClick}
        >
            <img
                style="pointer-events: none;"
                height="30px"
                src={iconSetSize} 
                alt="icon Anzahl der Felder in der Welt ändern"
            />
        </button>
        <!-- <div style="margin-left: 1em">
            <button on:click={handleButtonSaveClick}>speichern</button>
            <span>Dateiname: </span> <input bind:value={$worldFilename}> <span>.world</span>
            <br>
            speichern bei jedem Programmstart: <input type=checkbox bind:checked={$saveWorldOnStart}>
            <br>
            <span>laden: </span>
            <input type="file" id="input" on:input={handleFileUpload}>
        </div> -->
    </div>
</div>