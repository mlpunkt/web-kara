import { writable } from 'svelte/store';

export const saveSrcOnStart = writable(false);
export const saveWorldOnStart = writable(false);

export const srcFilename = writable('quelltext');
export const worldFilename = writable('welt');