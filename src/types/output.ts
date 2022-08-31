import { writable } from "svelte/store";

export type Output = Array<OutputItem>;

export enum OutputItemType {
    PYTHON_ERROR = "PYTHON_ERROR",
    PYTHON_PRINT = "PYTHON_PRINT",
    GUI_ERROR = "GUI_ERROR",
    SUCCESS = "SUCCESS",
}

export interface OutputItem {
    type: OutputItemType,
    message: string,
}

const initialOutput = [] as Array<OutputItem>;

export const output = writable(initialOutput);