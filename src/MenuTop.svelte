<script lang="ts">
    import {world, worldBeforeLastRun} from './types/world';
    import { tooltip } from './tooltip';
    import iconWorldBeforeRun from '../assets/iconWorldBeforeRun_normal.svg';


    function handleResetWorldClick() {
        $world = $worldBeforeLastRun;
    }
</script>



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