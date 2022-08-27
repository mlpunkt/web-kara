import { writable } from 'svelte/store';

export enum EditMode {
    KARA = "KARA",
    TREE = "TREE",
    LEAF = "LEAF",
}

export interface UiState {
    editMode: EditMode,
}

const initialUiState = {
    editMode: EditMode.KARA,
} as UiState


export const uiState = writable(initialUiState);