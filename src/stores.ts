import { writable } from 'svelte/store';

export const saveSrcOnStart = writable(false);
export const saveWorldOnStart = writable(false);

export const srcFilename = writable('quelltext');
export const worldFilename = writable('welt');

export type Variable = {
    name: string,
    value: any,
    type: string,
}

export const variables = writable(new Array<[Variable]>());
// export const variables = writable({} as {[key: string]: Variable});