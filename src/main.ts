import App from './App.svelte';

const beforeUnloadListener = (event) => {
	return event.returnValue = "Willst du diese Seite wiklich verlassen?";
};

window.addEventListener("beforeunload", beforeUnloadListener, {capture: true});

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const exerciseUrl = urlParams.get('exerciseUrl');
console.log(exerciseUrl)

if (exerciseUrl !== undefined && exerciseUrl !== null) {
	fetch(exerciseUrl, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
		},
	})
	.then(response => response.json())
	.then(exercise => {
		const app = new App({
			target: document.body,
			props: {
				exercise: exercise
			}
		});
	})
	.catch(startWithoutExercise)
} else {
	startWithoutExercise();
}


// const app = new App({
// 	target: document.body,
// 	props: {
// 		exercise: {},
// 	}
// });

// async function run() {	
// 	const response = await fetch(exerciseUrl, {
// 			method: 'GET',
// 			headers: {
// 				'Accept': 'application/json',
// 			},
// 		});

// 	if (response.status !== 200) {
// 		throw new Error('Falscher Statuscode');
// 	}

// 	const exercise = await response.json();

// 	const app = new App({
// 		target: document.body,
// 		props: {
// 			exercise: exercise
// 		}
// 	});
// }

// run()
// 	.catch(() => {

// 	})

function startWithoutExercise() {
	console.log('startWithoutExercise');
	const app = new App({
		target: document.body,
		props: {
			exercise: undefined
		}
	});
}

// (async () => {
//     try {
//         const text = await main();
//         console.log(text);
//     } catch (e) {
//         // Deal with the fact the chain failed
//     }
//     // `text` is not available here
// })();

// export default app;

