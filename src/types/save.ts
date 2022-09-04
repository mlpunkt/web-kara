import { writable } from 'svelte/store';

export const saveSrcOnStart = writable(true);
export const saveWorldOnStart = writable(true);

export const srcFilename = writable('quelltext');
export const worldFilename = writable('welt');