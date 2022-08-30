<script lang="ts">
    import {runProgram, sleepTimer, stopProgram} from './interpreter';
    import { tooltip } from './tooltip';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    // https://joshuatz.com/posts/2021/using-svg-files-in-svelte/
    import iconRun from '../assets/iconRun_normal.svg';
    import iconStop from '../assets/iconStop_normal.svg';
 
    function handleButtonRunClick() {
		// runProgram($srcInEditor);
        dispatch('run');
    }

    function handleButtonStopClick() {
        stopProgram.set(true);
    }
</script>

<div style="padding: 0.5em;">
    <span>schnell</span><input type="range" min="0.1" max="2" step="0.1" bind:value={$sleepTimer} class="slider"><span>langsam</span>

    <button
        title="Programm starten"
        use:tooltip
        class="iconRun"
        on:click={handleButtonRunClick}
        >
        <img
            style="pointer-events: none;"
            height="30px"
            src={iconRun} 
            alt="Icon Blatt legen"
        />
    </button>

    <button
        title="Programm anhalten"
        use:tooltip
        class="iconButton"
        on:click={handleButtonStopClick}
        >
        <img
            style="pointer-events: none;"
            height="30px"
            src={iconStop} 
            alt="Icon Blatt legen"
        />
    </button>    
</div>