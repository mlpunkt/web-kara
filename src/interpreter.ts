import { writable, derived } from 'svelte/store';
import {kara_move, kara_turnLeft, kara_turnRight, output_addItem, world_putLeaf, world_removeLeaf} from './actions';
import { OutputItemType } from './types/output';
import { initialWorld, world, worldBeforeLastRun, world_karaOnLeaf, world_mushroomFront, world_treeFront, world_treeLeft, world_treeRight } from './types/world';
import { variables } from './stores';
import * as R from 'fp-ts/Record';
import * as A from 'fp-ts/Array';
import * as F from 'fp-ts/Function';

let worldSubscription = initialWorld;
world.subscribe(newWorld => worldSubscription = newWorld);

// let variablesSubscription = new Array<Variable>();
// variables.subscribe(newVariables => variablesSubscription = newVariables);

export const sleepTimerSlider = writable(1);

const minSleepTimer = 0.1;
const maxSleepTimer = 2;

const minSleepTimerSlider = 0;
const maxSleepTimerSlider = 10;

// function suspension_lineNoRek(suspension: any) {
//     if (suspension.child.child.$isSuspension) {
//         return suspension_lineNoRek(suspension.child)
//     } else {
//         return suspension.child.$lineno;
//     }
// }

// function suspension_filenameRek(suspension: any) {
//     if (suspension.child.child.$isSuspension) {
//         return suspension_filenameRek(suspension.child)
//     } else {
//         return suspension.child.$filename;
//     }
// }

function suspension_lineAndFilename_Rek(suspension: any) {
    if (suspension.child.child && suspension.child.child.$filename && suspension.child.child.$lineno) {
        return suspension_lineAndFilename_Rek(suspension.child)
    } else {
        return {
            lineno: suspension.child.$lineno,
            filename: suspension.child.$filename
        }
    }
}

export const sleepTimer = derived(sleepTimerSlider, 
    $a => {
        // https://de.wikipedia.org/wiki/Zweipunkteform
        // x-Achse: wert des Sliders; y-Achse: Wert des sleepTimers
        const result = (minSleepTimer - maxSleepTimer) / (maxSleepTimerSlider - minSleepTimerSlider) * ($a - minSleepTimerSlider) + maxSleepTimer;
        return result;
    }
);

let sleepTimerSubscription = 1;
sleepTimer.subscribe(newSleepTimer => sleepTimerSubscription = newSleepTimer);


// let pauseProgramPromise: any; //Promise<>;
let pauseProgramPromiseResolve: any;

export function endPause() {
    if (pauseProgramPromiseResolve) {
        pauseProgramPromiseResolve();
    }
    pauseProgramFlag.set(false);
}

const stopProgramFlag = writable(false);
let stopProgramFlagSubscription = false;
stopProgramFlag.subscribe(newStopProgram => stopProgramFlagSubscription = newStopProgram);

export const pauseProgramFlag = writable(false);
let pauseProgramFlagSubscription = false;
pauseProgramFlag.subscribe(newPauseProgram => pauseProgramFlagSubscription = newPauseProgram);

export function stopProgram() {
    stopProgramFlag.set(true);
    if (sleepPromiseResolve) {
        sleepPromiseResolve();
    }
    if (pauseProgramPromiseResolve) {
        pauseProgramPromiseResolve();
    }
}

export function pauseProgram() {
    pauseProgramFlag.set(true);
    if (sleepPromiseResolve) {
        sleepPromiseResolve();
    }    
}

export function step() {
    // ruft suspension.resume() auf, bis im Code des Benutzers eine andere Zeile erreicht ist
    let stepDone = false;

    while (!stepDone) {
        suspension = suspension.resume();
        if (suspension.$isSuspension) {
            // Das Programm ist noch nicht abgearbeitet
            // const lineNo = suspension_lineNoRek(suspension);
            // if (suspension.child.$filename === "userSrc.py" && lastLineNumber !== suspension.child.$lineno) {
            // const filename = suspension_filenameRek(suspension);
            const {filename, lineno} = suspension_lineAndFilename_Rek(suspension)
            if (filename === "userSrc.py" && lastLineNumber !== lineno) {
                const variableState = suspension2VariablesRek(suspension);
                variables.set(variableState)

                stepDone = true;
                currentLineNumber.set(lineno)
                lastLineNumber = lineno;
                // currentLineNumber.set(suspension.child.$lineno)
                // lastLineNumber = suspension.child.$lineno;
            }
        } else {
            // Das Programm ist abgearbeitet
            stepDone = true;
            if (pauseProgramPromiseResolve) {
                pauseProgramPromiseResolve();
            }
        }
    }
}

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
    return Sk.ffi.remapToPy(world_treeFront(worldSubscription));
});

Sk.builtins.__treeLeft__ = new Sk.builtin.func(function () {
    return Sk.ffi.remapToPy(world_treeLeft(worldSubscription));
});

Sk.builtins.__treeRight__ = new Sk.builtin.func(function () {
    return Sk.ffi.remapToPy(world_treeRight(worldSubscription));
});

Sk.builtins.__onLeaf__ = new Sk.builtin.func(function () {
    return Sk.ffi.remapToPy(world_karaOnLeaf(worldSubscription));
});

Sk.builtins.__mushroomFront__ = new Sk.builtin.func(function () {
    return Sk.ffi.remapToPy(world_mushroomFront(worldSubscription));
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

let suspension;
let lastLineNumber = -1;

export function runProgram(src: string, breakpoints: Array<number>) {
    stopProgramFlag.set(false);
    pauseProgramFlag.set(false);

    worldBeforeLastRun.set(worldSubscription);

    const asyncFunc = async function() {
        Sk.configure({
            output: outf,
            debugging: true,
            // bei dem nächsten Programmstart werden die Globals zurückgesetzt
            retainGlobals: false,
        });

        interpreterState.set(InterpreterState.RUNNING);

        suspension = Sk.importMainWithBody("base", false, srcBase, true);
        while (suspension.$isSuspension && !stopProgramFlagSubscription) {
            if (suspension.data.type === 'Sk.promise') {
                await suspension.data.promise;
            }
            suspension = suspension.resume();
        }

        Sk.configure({
            output: outf,
            debugging: true,
            // bei dem nächsten Programmstart werden die Globals beibehalten (insbesonder das Objekt kara)
            retainGlobals: true,
        });

        suspension = Sk.importMainWithBody("userSrc", false, src, true);
        lastLineNumber = -1;
        while (suspension.$isSuspension && !stopProgramFlagSubscription) {
            const {filename, lineno} = suspension_lineAndFilename_Rek(suspension)
            if (filename === "userSrc.py") {
                // const lineNo = suspension_lineNoRek(suspension);
                if (lineno !== lastLineNumber) {
                    lastLineNumber = lineno;
                    currentLineNumber.set(lineno)

                    const variableState = suspension2VariablesRek(suspension);
                    variables.set(variableState)
                    // console.log(variableState)
                    
                    // if (interpreterStateSubscription === InterpreterState.RUNNING) {
                    //     await sleep(sleepTimerSubscription * 1000);
                    // }

                    if (breakpoints.includes(lineno)) {
                        pauseProgramFlag.set(true);
                    }

                    // await sleep(sleepTimerSubscription * 1000);

                    if (pauseProgramFlagSubscription) {
                        const pauseProgramPromise = new Promise((resolve, reject) => pauseProgramPromiseResolve = resolve);
                        interpreterState.set(InterpreterState.PAUSED);
                        await pauseProgramPromise;
                        interpreterState.set(InterpreterState.RUNNING);
                    } else {
                        await sleep(sleepTimerSubscription * 1000);
                    }

                    // if (interpreterStateSubscription === InterpreterState.RUNNING) {
                    // }
                }                
            }
            // if (test.data.type === 'Sk.promise') {
            //     await test.data.promise;
            // } else {
            //     // Kontrolle kurz abgeben, damit UI-Aktionen (z.B. Programm abbrechen) möglich sind
            //     // Parameter 0: Warten bis zum nächsen Event Cycle
            //     await sleep(0);
            // }

            if (suspension.$isSuspension) {
                suspension = suspension.resume();
            } else {
                // das Programm wurde bereits in einem Step beendet
            }
        }
    }

    asyncFunc()
        .then(result => {
            if (stopProgramFlagSubscription) {
                // Das Programm wurde durch den Benutzer angehalgen
                output_addItem(OutputItemType.GUI_ERROR, 'Das Programm wurde gestoppt in Zeile ' + currentLineNumberSubscription + ' .');
            } else {
                // Das Programm wurde erfolgreich beendet
                output_addItem(OutputItemType.SUCCESS, 'Das Programm wurde erfolgreich ausgeführt.')
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

const ignoreList = ["__doc__", "__name__", "__package__", "__file__", "Kara", "time"];

function suspension2Variables(suspension) {
    return F.pipe(
        suspension.child.$loc,
        R.filterWithIndex((index: string, v: any) => (!ignoreList.includes(index)) || index.startsWith("__")),
        R.toArray,
        A.map(
            (v: any) => ({
                name: v[0],
                value: v[1].v,
                type: v[1].tp$name,
            }))

        // R.mapWithIndex((index: string, v: any) => ({
        //     name: index,
        //     value: v.v,
        //     type: v.tp$name,
        // })),
        
    );
}

function suspension2VariablesRek(suspension) {
    function rek(child) {
        const varsFromTmps = child.$tmps ? obj2Variables(child.$tmps) : [];
        const varsFromCell = child.$cell ? obj2Variables(child.$cell) : [];

        // const variablesThis = [...obj2Variables(child.$tmps), ...obj2Variables(child.$cell)];
        const variablesThis = [...varsFromTmps, ...varsFromCell];
        if (child.child.$tmps || child.child.$cell) {
            return [variablesThis, ...rek(child.child)]
        } else {
            return [variablesThis];
        }
    }

    // return obj2Variables(suspension.child.$gbl);
    if (suspension.child.child.$tmps || suspension.child.child.$cell) {
        return [obj2Variables(suspension.child.$gbl), ...rek(suspension.child.child)]
    } else {
        return [obj2Variables(suspension.child.$gbl)]
    }
}

function obj2Variables(obj) {
    return F.pipe(
        obj,
        R.filterWithIndex((index: string, v: any) => !ignoreList.includes(index) && v !== undefined && !index.startsWith("$") && !index.startsWith("__")),
        R.toArray,
        A.map(
            (v: any) => ({
                name: v[0],
                value: v[1].v,
                type: v[1].tp$name,
            }))
    );
}