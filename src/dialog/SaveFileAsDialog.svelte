<script lang="ts">
    import { dialog_closeSaveFileAsDialog } from "../actions";
    import { dialogState } from "../types/dialogState";

    import Dialog from "./Dialog.svelte";

    function close() {
        dialog_closeSaveFileAsDialog();
    }

    function handleCancelClick() {
        dialog_closeSaveFileAsDialog();
    }

    function handleSaveClick() {
        if (filename.length > 0) {
            $dialogState.saveFileAs.okCallback(filename);
            dialog_closeSaveFileAsDialog();
        }
    }

    let filename = '';

    function handleNameInput(event) {
        filename = event.target.value;
    }

    // Der folgende Code erkennt, wenn der Dialog geöffnet wird und initialisiert filename
    let isOpen_old = false;
    $: {
        if (!isOpen_old && $dialogState.saveFileAs.isOpen) {
            // Der Dialog wurde gerade geöffenet
            filename = $dialogState.saveFileAs.filename;
        }
        isOpen_old = $dialogState.saveFileAs.isOpen;
    }    
</script>

<Dialog isOpen={$dialogState.saveFileAs.isOpen} on:close={close}>
    <p>Dateiname eingeben:</p>

    <input on:input={handleNameInput} value={filename} /> <span>.{$dialogState.saveFileAs.filenameExtension}</span>

    <div style="display: flex; justify-content: space-evenly">
        <button on:click={handleCancelClick}>Abbrechen</button>
        <button on:click={handleSaveClick}>speichern</button>
    </div>
</Dialog>