// https://joshuatz.com/posts/2021/using-svg-files-in-svelte/

declare module '*.svg' {
    const content: string;
    export default content;
}