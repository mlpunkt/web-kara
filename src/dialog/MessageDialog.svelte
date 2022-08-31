<script lang="ts">

    import { dialog_closeMessageDialog } from "../actions";

    import { dialogState } from "../types/dialogState";
    import Dialog from "./Dialog.svelte";


    function handleOkClick() {
        dialog_closeMessageDialog();
    }

    function close() {
        dialog_closeMessageDialog();
    }
</script>

<Dialog isOpen={$dialogState.message.isOpen} on:close={close}>
    <p>{$dialogState.message.title}</p>
    <p>{$dialogState.message.message}</p>
    <button on:click={handleOkClick}>OK</button>
</Dialog>