<script lang="ts">

    import { dialog_closeChangeSizeDialog } from "../actions";

    import { dialogState } from "../types/dialogState";
    import Dialog from "./Dialog.svelte";


    function handleOkClick() {
        dialog_closeChangeSizeDialog();
    }

    function close() {
        dialog_closeChangeSizeDialog();
    }
</script>

<Dialog isOpen={$dialogState.changeSize.isOpen} on:close={close}>
    Neue Größe für die Welt eingeben:
    
    <button on:click={handleOkClick}>OK</button>
</Dialog>