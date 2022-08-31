import { writable } from "svelte/store";

export interface DialogState {
    message: {
        isOpen: boolean,
        title: string,
        message: string,
    }
}

const initialDialogState = {
    message: {
        isOpen: false,
        title: '',
        message: '',
    }
} as DialogState

export const dialogState = writable(initialDialogState);