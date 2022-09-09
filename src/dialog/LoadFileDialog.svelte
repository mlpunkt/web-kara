<script lang="ts">
    import { dialog_closeLoadFileDialog } from "../actions";
    import { dialogState } from "../types/dialogState";

    import Dialog from "./Dialog.svelte";

    function close() {
        dialog_closeLoadFileDialog();
    }

    function handleCancelClick() {
        dialog_closeLoadFileDialog();
    }


    function handleFileUpload(evt) {
        const file = evt.target.files[0];
        const fileNameWithoutExtension = file.name.split('.')[0]

        let fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = e => { 
            const contentString = <string>fileReader.result;
            $dialogState.loadFileDialog.okCallback(fileNameWithoutExtension, contentString);
        }

        evt.target.value = '';

        dialog_closeLoadFileDialog();
    }

    // Der folgende Code erkennt, wenn der Dialog geöffnet wird und initialisiert filename
    // let isOpen_old = false;
    // $: {
    //     if (!isOpen_old && $dialogState.loadFileDialog.isOpen) {
    //         // Der Dialog wurde gerade geöffenet
            
    //     }
    //     isOpen_old = $dialogState.loadFileDialog.isOpen;
    // }
</script>

<Dialog isOpen={$dialogState.loadFileDialog.isOpen} on:close={close}>
    <p>Datei hochladen:</p>

    <input type="file" id="input" on:input={handleFileUpload}>

    <div style="display: flex; justify-content: space-evenly">
        <button on:click={handleCancelClick}>Abbrechen</button>
    </div>
</Dialog>