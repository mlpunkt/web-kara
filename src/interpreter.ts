import { writable } from 'svelte/store';
import {kara_move, kara_turnLeft, kara_turnRight, world_putLeaf, world_removeLeaf} from './actions';
import { initialWorld, world, world_karaOnLeaf, world_mushroomFront, world_treeFront, world_treeLeft, world_treeRight } from './types/world';

let worldSubscription = initialWorld;
world.subscribe(newWorld => worldSubscription = newWorld);

export const sleepTimer = writable(1);
let sleepTimerSubscription = 1;
sleepTimer.subscribe(newSleepTimer => sleepTimerSubscription = newSleepTimer);

export const stopProgram = writable(false);
let stopProgramSubscription = false;
stopProgram.subscribe(newStopProgram => stopProgramSubscription = newStopProgram);

export const currentLineNumber = writable(1);

Sk.builtins.__move__ = new Sk.builtin.func(function () {
    kara_move();
});

Sk.builtins.__turnRight__ = new Sk.builtin.func(function () {
    kara_turnRight();
});

Sk.builtins.__turnLeft__ = new Sk.builtin.func(function () {
    kara_turnLeft();
});


Sk.builtins.__putLeaf__ = new Sk.builtin.func(function () {
    world_putLeaf(worldSubscription.kara.position);
});

Sk.builtins.__removeLeaf__ = new Sk.builtin.func(function () {
    world_removeLeaf(worldSubscription.kara.position);
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


const sleep = (milliseconds) =>  new Promise(resolve => setTimeout(resolve, milliseconds))

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
    console.log(text);
}

export function runProgram(src: string) {
    stopProgram.set(false);
    const asyncFunc = async function() {
        Sk.configure({
            output: outf,
            debugging: true,
            retainGlobals: true,
        });

        let suspension = Sk.importMainWithBody("base", false, srcBase, true);
        while (suspension.$isSuspension && !stopProgramSubscription) {
            if (suspension.data.type === 'Sk.promise') {
                await suspension.data.promise;
            }
            suspension = suspension.resume();
        }

        suspension = Sk.importMainWithBody("userSrc", false, src, true);
        let lastLineNumber = -1
        while (suspension.$isSuspension && !stopProgramSubscription) {
            if (suspension.child.$filename === "userSrc.py") {
                if (suspension.child.$lineno !== lastLineNumber) {
                    lastLineNumber = suspension.child.$lineno;
                    console.log(suspension.child.$lineno)                
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
        }
    }

    asyncFunc()
        .then(() => console.log('fertig'))
        .catch((e) => console.log(e));
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