import { writable } from "svelte/store";

export interface DialogState {
    message: {
        isOpen: boolean,
        title: string,
        message: string,
    },
    changeSize: {
        isOpen: boolean,
    }
}

const initialDialogState = {
    message: {
        isOpen: false,
        title: '',
        message: '',
    },
    changeSize: {
        isOpen: false,
    }
} as DialogState

export const dialogState = writable(initialDialogState);