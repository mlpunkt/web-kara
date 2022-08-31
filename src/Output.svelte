<script lang="ts">
    import { output, OutputItemType } from "./types/output";

</script>

<div>
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