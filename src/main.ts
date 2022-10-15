import App from './App.svelte';

const beforeUnloadListener = (event) => {
	return event.returnValue = "Willst du diese Seite wiklich verlassen?";
};

window.addEventListener("beforeunload", beforeUnloadListener, {capture: true});


const app = new App({
	target: document.body,
	props: {
	}
});

export default app;

