<script lang="ts">
    import {pauseProgramFunc, sleepTimer, stopProgramFunc, interpreterState, InterpreterState} from './interpreter';
    import { tooltip } from './tooltip';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    // https://joshuatz.com/posts/2021/using-svg-files-in-svelte/
    import iconRun from '../assets/iconRun_normal.svg';
    import iconStop from '../assets/iconStop_normal.svg';
    import iconPause from '../assets/iconPause_normal.svg';
    import iconStep from '../assets/iconStep_normal.svg';
 
    function handleButtonRunClick() {
		// runProgram($srcInEditor);
        dispatch('run');
    }

    function handleButtonStopClick() {
        // stopProgram.set(true);
        $stopProgramFunc()
    }

    function handleButtonPauseClick() {
        $pauseProgramFunc();
        // // pauseProgram.update(oldValue => !oldValue);
        // if ($pauseProgram){
        //     $resumeProgramFunc();
        // } else {
        //     $pauseProgramFunc();
        // }
    }

    function handleButtonStepClick() {

    }
</script>

<div style="padding: 0.5em;">
    <span>schnell</span><input type="range" min="0.1" max="2" step="0.1" bind:value={$sleepTimer} class="slider"><span>langsam</span>

    <!-- disabled={$interpreterState !== InterpreterState.STOPPED} -->
    <button
        title="Programm starten (von Anfang)"
        use:tooltip
        class="iconRun"
        on:click={handleButtonRunClick}
        >
        <img
            style="pointer-events: none;"
            height="30px"
            src={iconRun} 
            alt="Icon Programm starten"
        />
    </button>

    <button
        title="Programm stoppen"
        use:tooltip
        class="iconButton"
        on:click={handleButtonStopClick}
        >
        <img
            style="pointer-events: none;"
            height="30px"
            src={iconStop} 
            alt="Icon Programm stoppen"
        />
    </button>

    <span style="margin-left: 1em"></span>

    <button
        title="Programm pausieren"
        use:tooltip
        class="iconButton"
        on:click={handleButtonPauseClick}
        >
        <img
            style="pointer-events: none;"
            height="30px"
            src={iconPause} 
            alt="Icon Programm pausieren"
        />
    </button>

    <button
        title="Einzelschritt"
        use:tooltip
        class="iconButton"
        on:click={handleButtonStepClick}
        >
        <img
            style="pointer-events: none;"
            height="30px"
            src={iconStep}
            alt="Icon Einzelschritt"
        />
    </button>

 
</div>