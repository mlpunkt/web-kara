<script lang="ts">

    import { dialog_closeChangeSizeDialog, dialog_openMessageDialog, world_setSize } from "../actions";

    import { dialogState } from "../types/dialogState";
    import { world } from "../types/world";
    import Dialog from "./Dialog.svelte";


    function handleOkClick() {
        if (sizeX > 30 || sizeY > 30) {
            dialog_openMessageDialog('Fehler', 'Die Welt darf maximal 30 Felder breit und 30 Felder hoch sein.');
            dialog_closeChangeSizeDialog();
        } else {
            world_setSize(sizeX, sizeY);
            dialog_closeChangeSizeDialog();
        }
        // world_setSize(sizeX, sizeY);
        // dialog_closeChangeSizeDialog();
    }

    function close() {
        dialog_closeChangeSizeDialog();
    }    

    let sizeX = 9;
    let sizeY = 9;

    // Der folgende Code erkennt, wenn der Dialog geöffnet wird und initialisiert sizeX und sizeY
    let isOpen_old = false;
    $: {
        if (!isOpen_old && $dialogState.changeSize.isOpen) {
            // Der Dialog wurde gerade geöffenet
            sizeX = $world.sizeX;
            sizeY = $world.sizeY;
        }
        isOpen_old = $dialogState.changeSize.isOpen
    }
</script>

<Dialog isOpen={$dialogState.changeSize.isOpen} on:close={close}>
    <p>Neue Größe für die Welt eingeben:<p>

    <p>Größe nach rechts: <input type=number bind:value={sizeX} step=1 min=1 max=20> </p>
    <p>Größe nach unten:  <input type=number bind:value={sizeY} step=1 min=1 max=20> </p>
    
    <button on:click={close}>Abbrechen</button>
    <button on:click={handleOkClick}>OK</button>
</Dialog>