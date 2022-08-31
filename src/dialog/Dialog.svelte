<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let isOpen = false;
</script>

{#if isOpen}
    <div 
        style="z-index: 1000; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: white; opacity: 0.9"
        on:click={() => dispatch('close')}>
    </div>

    <div style="z-index: 1001; position: fixed; top: 0; left:0; width: 100%; height: 100%; pointer-events: none;  display: flex; justify-content: center; align-items: center;">
        <div style="background-color: white; width: 30%; margin: 0 auto; pointer-events: auto; border: 2px solid lightgrey; padding: 5px; margin: 5px;">
            <slot></slot>
        </div>
    </div>
{/if}