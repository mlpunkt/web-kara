import { writable } from "svelte/store";

export interface DialogState {
    message: {
        isOpen: boolean,
        title: string,
        message: string,
    },
    changeSize: {
        isOpen: boolean,
    },
    saveFileAs: {
        isOpen: boolean,
        okCallback: (filename: string) => void,
        filename: string,
        filenameExtension: string,
    },
    loadFileDialog: {
        isOpen: boolean,
        okCallback: (filename: string, contentString: string) => void,
    }
}

const initialDialogState = {
    message: {
        isOpen: false,
        title: '',
        message: '',
    },
    saveFileAs: {
        isOpen: false,
        okCallback: () => null,
        filename: '',
        filenameExtension: '',
    },
    changeSize: {
        isOpen: false,
    },
    loadFileDialog: {
        isOpen: false,
        okCallback: () => null,
    }
} as DialogState

export const dialogState = writable(initialDialogState);