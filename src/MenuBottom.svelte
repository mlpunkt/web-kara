<script lang="ts">
    import {sleepTimer} from './interpreter';
    import { tooltip } from './tooltip';

    // https://joshuatz.com/posts/2021/using-svg-files-in-svelte/
    import iconRun from '../assets/iconRun_normal.svg';
    import iconStop from '../assets/iconStop_normal.svg';
 
    function handleButtonRunClick() {

    }

    function handleButtonStopClick() {

    }
</script>

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
