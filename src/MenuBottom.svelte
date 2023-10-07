<script lang="ts">
    import { sleepTimerSlider, stopProgram, interpreterState, InterpreterState, endPause, pauseProgram, step} from './interpreter';
    import { tooltip } from './tooltip';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    // https://joshuatz.com/posts/2021/using-svg-files-in-svelte/
    import iconRun from '../assets/iconRun_normal.svg';
    import iconStop from '../assets/iconStop_normal.svg';
    import iconPause from '../assets/iconPause_normal.svg';
    import iconStep from '../assets/iconStep_normal.svg';
    import { output_addItem, output_reset } from './actions';
    import { OutputItemType } from './types/output';
 
    function handleButtonRunClick() {
		// runProgram($srcInEditor);
        if ($interpreterState === InterpreterState.STOPPED) {
            dispatch('run');
            output_reset();
        } else {
           output_addItem(OutputItemType.GUI_ERROR, 'Das Programm läuft bereits.')
        }
    }

    function handleButtonStopClick() {
        // stopProgram.set(true);
        // $stopProgramFunc()
        stopProgram()
    }

    function handleButtonPauseClick() {
        if ($interpreterState === InterpreterState.RUNNING) {
            pauseProgram();
        } else if ($interpreterState === InterpreterState.PAUSED) {
            endPause();
        }
    }

    function handleButtonStepClick() {
        if ($interpreterState === InterpreterState.PAUSED) {
            step();
        }
    }
</script>

<div>
    <div class="panel" style="display: flex">
        <div>
            Geschwindigkeit: <br>
            <input type="range" min="0" max="20" step="0.1" bind:value={$sleepTimerSlider} class="slider">
        </div>

        <span style="margin-left: 0.5em"></span>

        <!-- disabled={$interpreterState !== InterpreterState.STOPPED} -->
        <button
            title="Programm starten (von Anfang)"
            use:tooltip
            class="iconButton"
            on:click={handleButtonRunClick}
            >
            <img
                style="pointer-events: none;"
                class:highlightButtonRed={$interpreterState === InterpreterState.RUNNING}
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

        <span style="margin-left: 0.5em"></span>

        <button
            title="Programm pausieren"
            use:tooltip
            class="iconButton"
            on:click={handleButtonPauseClick}
            class:highlightButtonGreen={$interpreterState === InterpreterState.PAUSED}
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
            class:highlightButtonGreen={$interpreterState === InterpreterState.PAUSED}
            >
            <img
                style="pointer-events: none;"
                height="30px"
                src={iconStep}
                alt="Icon Einzelschritt"
            />
        </button>
    </div>
</div>

<style>
    .highlightButtonRed {
        background-color: red;
    }

    .highlightButtonGreen {
        background-color: green;
    }
</style>