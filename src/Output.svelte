<script lang="ts">
import { InterpreterState, interpreterState } from "./interpreter";

    import { output, OutputItemType } from "./types/output";

</script>

<div>
    <p>
		{#if $interpreterState === InterpreterState.STOPPED}
			Programm gestoppt
		{/if}
		{#if $interpreterState === InterpreterState.RUNNING}
			Programm läuft
		{/if}
		{#if $interpreterState === InterpreterState.PAUSED}
			Programm pausiert
		{/if}
	</p>
    
    <p>Ausgabe:</p>
    {#each $output as item}
        {#if item.type === OutputItemType.PYTHON_PRINT}
            <p>{item.message}</p>
        {/if}

        {#if item.type === OutputItemType.PYTHON_ERROR}
            <p style="color: red">{item.message}</p>
        {/if}

        {#if item.type === OutputItemType.GUI_ERROR}
            <p style="color: orange">{item.message}</p>
        {/if}

        {#if item.type === OutputItemType.SUCCESS}
            <p style="color: green">{item.message}</p>
        {/if}
    {/each}
</div>