<script lang="ts">
    import {world, worldBeforeLastRun} from './types/world';

    function handleResetWorldClick() {
        $world = $worldBeforeLastRun;
    }
</script>

<button on:click={handleResetWorldClick}>Welt zurücksetzen auf Zustand vor der letzen Programmausführung</button>