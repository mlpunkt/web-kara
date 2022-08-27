// webworker.js

// Setup your project to serve `py-worker.js`. You should also serve
// `pyodide.js`, and all its associated `.asm.js`, `.data`, `.json`,
// and `.wasm` files as well:
// importScripts("https://cdn.jsdelivr.net/pyodide/v0.21.1/full/pyodide.js");
importScripts("pyodide/pyodide.js");

async function loadPyodideAndPackages() {
    self.pyodide = await loadPyodide();
}
let pyodideReadyPromise = loadPyodideAndPackages();

function sleepSync(millis){ // Use only in worker thread, currently Chrome-only
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, millis);
}

function lock_close(lockArray) {
    Atomics.store(lockArray, 0, 1);
}

function lock_waitUntilOpen(lockArray) {
    Atomics.wait(lockArray, 0, 1);
}

async function kara_move() {
    postMessage({ cmd: 'move' });
    sleepSync(speedArray[0])
}

function kara_turn_cw() {
    postMessage({ cmd: 'turn_cw' });
    sleepSync(speedArray[0])
}

function kara_turn_ccw() {
    postMessage({ cmd: 'turn_ccw' });
    sleepSync(speedArray[0])
}

function callBoolCmd(resultLockArray, resultArray, cmd) {
    lock_close(resultLockArray);
    postMessage({ cmd: cmd });
    lock_waitUntilOpen(resultLockArray);
    result = resultArray[0] === 1;
    return result;
}

function kara_treeFront() {
    return callBoolCmd(self.resultLockArray, self.resultArray, 'treeFront');

    // lock_close(self.resultLockArray);
    // postMessage({ cmd: 'treeFront' });
    // lock_waitUntilOpen(self.resultLockArray);
    // result = self.resultArray[0] === 1;
    // return result;
}

function kara_treeLeft() {
    return callBoolCmd(self.resultLockArray, self.resultArray, 'treeLeft');
    // // an stelle 0 location 0, wert 1 speichern
    // Atomics.store(self.resultLockArray, 0, 1);
    // console.log('Lock schließen')
    
    // postMessage({ cmd: 'treeLeft' });

    // // Wait until location 0 isn't value 1
    // Atomics.wait(self.resultLockArray, 0, 1);
    // console.log('worker - Lock geöffnet')

    // console.log('treeFront ' + self.resultArray[0] === 1);

    // return self.resultArray[0] === 1
}

function kara_treeRight() {
    return callBoolCmd(self.resultLockArray, self.resultArray, 'treeRight');

    // // an stelle 0 location 0, wert 1 speichern
    // Atomics.store(self.resultLockArray, 0, 1);
    // console.log('Lock schließen')
    
    // postMessage({ cmd: 'treeRight' });

    // // Wait until location 0 isn't value 1
    // Atomics.wait(self.resultLockArray, 0, 1);
    // console.log('worker - Lock geöffnet')

    // console.log('treeFront ' + self.resultArray[0] === 1);

    // return self.resultArray[0] === 1
}

function kara_onLeaf() {
    return callBoolCmd(self.resultLockArray, self.resultArray, 'onLeaf');

    // // an stelle 0 location 0, wert 1 speichern
    // Atomics.store(self.resultLockArray, 0, 1);
    // console.log('Lock schließen')
    
    // postMessage({ cmd: 'onLeaf' });

    // // Wait until location 0 isn't value 1
    // Atomics.wait(self.resultLockArray, 0, 1);
    // console.log('worker - Lock geöffnet')

    // console.log('treeFront ' + self.resultArray[0] === 1);

    // return self.resultArray[0] === 1
}

function kara_putLeaf() {
    postMessage({ cmd: 'putLeaf' });
}

function kara_removeLeaf(){
    postMessage({ cmd: 'removeLeaf' });
}

function setLineNumber(lineNumber) {
    postMessage({ cmd: 'lineNumber', lineNumber: lineNumber})
}

function testExit() {
    if (exitArray[0] === 1) {
        return true;
    } else {
        return false;
    }
}


const pythonBaseCode = `print('baseCode')
import js
import time
import sys
import inspect

def move():
    js.kara_move()

def turnRight():
    js.kara_turn_cw()

def turnLeft():
    js.kara_turn_ccw()

def treeFront():
    return js.kara_treeFront()

def treeLeft():
    tl = js.kara_treeLeft()
    print("tl " + str(tl))
    return tl

def treeRight():
    return js.kara_treeRight()
        
def onLeaf():
    return js.kara_onLeaf()

def putLeaf():
    js.kara_putLeaf()

def removeLeaf():
    js.kara_removeLeaf()
    `

const startCode = `print('startCode')
import js
import sys
import inspect

def tracefunc(frame, event, arg):
    if js.testExit():
        print('Exit')
        sys.exit()
    
    if event == 'line':
        module = inspect.getmodule(frame)
        if hasattr(module, '__file__'):
            filename = module.__file__
            if filename == '/home/pyodide/userCode.py':
                js.setLineNumber(frame.f_lineno)
        else:
            pass
            
    return tracefunc

# https://stackoverflow.com/questions/55998616/how-to-trace-code-run-in-global-scope-using-sys-settrace
sys.settrace(tracefunc)
sys._getframe().f_trace = tracefunc

import userCode
`;


self.onmessage = async (event) => {
    if (event.data.type === 'init') {

    }
    if (event.data.type === 'run') {
        console.log('worker - run');

        await pyodideReadyPromise;

        self.speedBuffer = event.data.speedBuffer;
        self.speedArray = new Int32Array(speedBuffer);

        self.exitBuffer = event.data.exitBuffer;
        self.exitArray = new Int32Array(exitBuffer);

        self.resultLockBuffer = event.data.resultLockBuffer;
        self.resultLockArray = new Int32Array(self.resultLockBuffer);
    
        self.resultBuffer = event.data.resultBuffer;
        self.resultArray = new Int8Array(self.resultBuffer);

        // let testfile = pyodide.FS.readFile("base.py", { encoding: "utf8" });
        // console.log(testfile);

        pyodide.FS.writeFile('kara.py', pythonBaseCode);

        pyodide.FS.writeFile('userCode.py', event.data.pythonSrc);

        let testfile = pyodide.FS.readFile("userCode.py", { encoding: "utf8" });
        console.log(testfile)

        // pyodide.FS.writeFile('start.py', startCode);

        // pyodide.pyimport('start')

        pyodide.runPython (startCode)

        console.log('Python Ende?')
        // pyodide.runPython(pythonBaseCode)
        // pyodide.runPython(event.data.pythonSrc)

        // await run(event.data.pythonSrc);
    }
};