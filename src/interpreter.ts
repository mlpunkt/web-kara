import { writable } from 'svelte/store';
import {kara_move, kara_turnLeft, kara_turnRight, output_addItem, world_putLeaf, world_removeLeaf} from './actions';
import { OutputItemType } from './types/output';
import { initialWorld, world, worldBeforeLastRun, world_karaOnLeaf, world_mushroomFront, world_treeFront, world_treeLeft, world_treeRight } from './types/world';

let worldSubscription = initialWorld;
world.subscribe(newWorld => worldSubscription = newWorld);

export const sleepTimer = writable(1);
let sleepTimerSubscription = 1;
sleepTimer.subscribe(newSleepTimer => sleepTimerSubscription = newSleepTimer);


// let pauseProgramPromise: any; //Promise<>;
// let pauseProgramPromiseResolve: any;

// function endPause() {
//     if (pauseProgramPromiseResolve) {
//         pauseProgramPromiseResolve();
//     }
// }

const stopProgramFlag = writable(false);
let stopProgramFlagSubscription = false;
stopProgramFlag.subscribe(newStopProgram => stopProgramFlagSubscription = newStopProgram);

export const pauseProgramFlag = writable(false);
let pauseProgramFlagSubscription = false;
pauseProgramFlag.subscribe(newPauseProgram => pauseProgramFlagSubscription = newPauseProgram);

export const stopProgramFunc = writable(stopProgram);

function stopProgram() {
    stopProgramFlag.set(true);
    if (sleepPromiseResolve) {
        sleepPromiseResolve();
    }   
}

export const pauseProgramFunc = writable(() => {
    // if (interpreterStateSubscription === InterpreterState.PAUSED) {
    //     pauseProgramFlag.set(false);
    //     endPause();
    // } else {
    //     pauseProgramFlag.set(true);
    //     // if (sleepPromiseResolve) {
    //     //     sleepPromiseResolve()
    //     // }
    // }
});

// export const resumeProgramFunc = writable(() => pauseProgramFlag.set(false));

export enum InterpreterState {
    STOPPED = "STOPPED",
    RUNNING = "RUNNING",
    PAUSED = "PAUSED",
}

export const interpreterState = writable(InterpreterState.STOPPED);
let interpreterStateSubscription = InterpreterState.STOPPED;
interpreterState.subscribe(newVal => interpreterStateSubscription = newVal);

let currentLineNumberSubscription = null;
export const currentLineNumber = writable<number | null>(null);
currentLineNumber.subscribe(newVal => currentLineNumberSubscription = newVal);

Sk.builtins.__move__ = new Sk.builtin.func(function () {
    const result = kara_move();
    if (result) {
        stopProgram();
        output_addItem(OutputItemType.PYTHON_ERROR, result.message);
    }
});

Sk.builtins.__turnRight__ = new Sk.builtin.func(function () {
    kara_turnRight();
});

Sk.builtins.__turnLeft__ = new Sk.builtin.func(function () {
    kara_turnLeft();
});

Sk.builtins.__putLeaf__ = new Sk.builtin.func(function () {
    const result = world_putLeaf(worldSubscription.kara.position);
    if (result) {
        stopProgram();
        output_addItem(OutputItemType.PYTHON_ERROR, result.message);
    }
});

Sk.builtins.__removeLeaf__ = new Sk.builtin.func(function () {
    const result = world_removeLeaf(worldSubscription.kara.position);
    if (result) {
        stopProgram();
        output_addItem(OutputItemType.PYTHON_ERROR, result.message);
    }
});

Sk.builtins.__treeFront__ = new Sk.builtin.func(function () {
    return world_treeFront(worldSubscription);
});

Sk.builtins.__treeLeft__ = new Sk.builtin.func(function () {
    return world_treeLeft(worldSubscription);
});

Sk.builtins.__treeRight__ = new Sk.builtin.func(function () {
    return world_treeRight(worldSubscription);
});

Sk.builtins.__onLeaf__ = new Sk.builtin.func(function () {
    return world_karaOnLeaf(worldSubscription);
});

Sk.builtins.__mushroomFront__ = new Sk.builtin.func(function () {
    return world_mushroomFront(worldSubscription);
});


Sk.builtins.__st__ = new Sk.builtin.func(function () {
    // return sleepTimerSubscription;
    return 0;
});

// const sleep = (milliseconds) =>  new Promise(resolve => setTimeout(resolve, milliseconds))

let sleepPromiseResolve: any;
const sleep = (milliseconds) => {
    let sleepPromise = new Promise(resolve => {
        sleepPromiseResolve = resolve;
        setTimeout(resolve, milliseconds);
    });
    return sleepPromise;
}

const srcBase=`
import time

class Kara:
    def move(self):
        __move__()
        time.sleep(__st__())

    def turnLeft(self):
        __turnLeft__()
        time.sleep(__st__())

    def turnRight(self):
        __turnRight__()
        time.sleep(__st__())

    def putLeaf(self):
        __putLeaf__()
        time.sleep(__st__())

    def removeLeaf(self):
        __removeLeaf__()
        time.sleep(__st__())

    def treeFront(self):
        return __treeFront__()

    def treeLeft(self):
        return __treeLeft__()

    def treeRight(self):
        return __treeRight__()

    def onLeaf(self):
        return __onLeaf__()

    def mushroomFront(self):
        return __mushroomFront__()

kara = Kara()
`;

function outf(text) { 
    output_addItem(OutputItemType.PYTHON_PRINT, text);
}

export function runProgram(src: string) {
    stopProgramFlag.set(false);
    // pauseProgramFlag.set(false);
    // endPause();

    worldBeforeLastRun.set(worldSubscription);

    const asyncFunc = async function() {
        Sk.configure({
            output: outf,
            debugging: true,
            retainGlobals: true,
        });

        interpreterState.set(InterpreterState.RUNNING);

        let suspension = Sk.importMainWithBody("base", false, srcBase, true);
        while (suspension.$isSuspension && !stopProgramFlagSubscription) {
            if (suspension.data.type === 'Sk.promise') {
                await suspension.data.promise;
            }
            suspension = suspension.resume();
        }

        suspension = Sk.importMainWithBody("userSrc", false, src, true);
        let lastLineNumber = -1
        while (suspension.$isSuspension && !stopProgramFlagSubscription) {
            if (suspension.child.$filename === "userSrc.py") {
                if (suspension.child.$lineno !== lastLineNumber) {
                    lastLineNumber = suspension.child.$lineno;
                    currentLineNumber.set(suspension.child.$lineno)
                    await sleep(sleepTimerSubscription * 1000);
                }
            }
            // if (test.data.type === 'Sk.promise') {
            //     await test.data.promise;
            // } else {
            //     // Kontrolle kurz abgeben, damit UI-Aktionen (z.B. Programm abbrechen) möglich sind
            //     // Parameter 0: Warten bis zum nächsen Event Cycle
            //     await sleep(0);
            // }
            suspension = suspension.resume();

            // if (pauseProgramFlagSubscription) {
            //     pauseProgramPromise = new Promise((resolve, reject) => pauseProgramPromiseResolve = resolve);
            //     interpreterState.set(InterpreterState.PAUSED);
            //     await pauseProgramPromise;
            //     interpreterState.set(InterpreterState.RUNNING);
            // }
        }
    }

    asyncFunc()
        .then(result => {
            if (stopProgramFlagSubscription) {
                // Das Programm wurde durch den Benutzer angehalgen
                output_addItem(OutputItemType.GUI_ERROR, 'Das Programm wurde gestoppt in Zeile ' + currentLineNumberSubscription + ' .');
            } else {
                // Das Programm wurde erfolgreich beendet
                output_addItem(OutputItemType.SUCCESS, 'Das Programm erfolgreich ausgeführt.')
            }
        })
        .catch(error => {
            // console.log(error);
            const errorMessage = 'Fehler im Python-Quelltext, vermutlich in Zeile ' + error.traceback[0].lineno.toString() + '.';
            output_addItem(OutputItemType.PYTHON_ERROR, errorMessage);
            const errorMessage2 = error.args.v[0].v;
            output_addItem(OutputItemType.PYTHON_ERROR, errorMessage2);
            output_addItem(OutputItemType.PYTHON_ERROR, 'Programm nach einem Fehler angehalten.');
        })
        .finally(() => {
            interpreterState.set(InterpreterState.STOPPED)
            currentLineNumber.set(null);
        });
}

// evtl. alternative Funktion zum Starten eines Programms:
// function handleButtonRunClick() {
// 	var myPromise = Sk.misceval.asyncToPromise(function() {
// 		return Sk.importMainWithBody("<stdin>", false, src, true);
// 	});

// 	myPromise.then(function(mod) {
// 		console.log('success');
// 	},
// 		function(err) {
// 		console.log(err.toString());
// 	});
// }