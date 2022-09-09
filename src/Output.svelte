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
</div>
<div style="overflow-y: scroll; flex-grow: 1; flex-basis: 100px; flex-shrink: 0">
    {#each $output as item}
        {#if item.type === OutputItemType.PYTHON_PRINT}
            <p class="outputItem">{item.message}</p>
        {/if}

        {#if item.type === OutputItemType.PYTHON_ERROR}
            <p class="outputItem" style="color: red">{item.message}</p>
        {/if}

        {#if item.type === OutputItemType.GUI_ERROR}
            <p class="outputItem" style="color: orange">{item.message}</p>
        {/if}

        {#if item.type === OutputItemType.SUCCESS}
            <p class="outputItem" style="color: green">{item.message}</p>
        {/if}
    {/each}
</div>

<style>
    .outputItem {
        margin: 0px;
        padding: 0px;
    }
</style>