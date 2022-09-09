<script lang="ts">
import {EditorView} from "codemirror"
import {basicSetup} from './codemirrorSetup';
import {EditorState, Compartment} from "@codemirror/state";
import {python} from "@codemirror/lang-python"
import {lineHighlightField, addLineHighlight} from './lineMarkExtension';
import {currentLineNumber, InterpreterState, interpreterState} from './interpreter';
import { breakpointGutter, breakpointState } from "./BreakpointGutter";
import { indentUnit } from "@codemirror/language";

export function getText() {
    if (editorView) {
        return editorView.state.doc.toString();
    } else {
        return '';
    }
}

export function setText(text: string) {
    if (editorView) {
        // const transaction = editorView.state.update({changes: {from: 0, to: editorView.state.doc.length, insert: text}});
        // editorView.dispatch(transaction);

        editorView.dispatch({changes: {from: 0, to: editorView.state.doc.length, insert: text}});
    }
}

export let initialText = '';

$: {
    if (editorView) {
        highlightLine($currentLineNumber)
    }
}

$: {
    if (editorView) {
        if ($interpreterState === InterpreterState.RUNNING || $interpreterState === InterpreterState.PAUSED) {
            setReadOnly(true);
        } else {
            setReadOnly(false);
        }
    }
}

let editorView: EditorView;

export function getBreakpoints() {
    // console.log(editorView.state.field(breakpointState));
    const stateField = editorView.state.field(breakpointState)
    const breakpoints = [] as Array<number>;
    let iter = stateField.iter();
    while (iter.value !== null) {
        // const gutterMaerker = iter.from;
        const line  = editorView.state.doc.lineAt(iter.from).number
        breakpoints.push(line);
        iter.next();
    }
    return breakpoints;
}

export function highlightLine(lineNo: number | null) {
    if (typeof lineNo === 'number') {
        const docPosition = editorView.state.doc.line(lineNo).from;
        editorView.dispatch({effects: addLineHighlight.of(docPosition)});
    } else {
        editorView.dispatch({effects: addLineHighlight.of(null)});
    }
}

const readonly = EditorState.readOnly.of(true)

let readOnlyCompartment = new Compartment;

export function setReadOnly(readonly: boolean) {
    editorView.dispatch({
        effects: readOnlyCompartment.reconfigure(EditorState.readOnly.of(readonly)),
    })

    highlightLine($currentLineNumber);
}

// function setReadonly(view, size) {
//   view.dispatch({
//     effects: readOnlyCompartment.reconfigure(EditorState.tabSize.of(size))
//   })
// }

function editorAction(node) {
    // the node has been mounted in the DOM

    // const logger = EditorView.updateListener.of(update => {
    //     console.log('update')
    //     if(update.docChanged) {
    //         console.log(editorView.state.doc.toString())
    //         // fire('textChange', {
    //         //     value: getValue(),
    //         //     cursor: getCursor(),
    //         //     history: {}
    //         // })
    //     }
    // });

    // const ex = lineMarkExtension();

    // editorView = new EditorView({
    //     extensions: [basicSetup, python(), ex],
    //     parent: node
    // });

    const theme = EditorView.theme({
        // "&": {"max-height": "800px"},
        // "&": {"flex-basis": "90%"},
        "&": {width: "100%", height: "100%"},
        // ".cm-scroller": {overflow: "auto"}
    });


    // https://discuss.codemirror.net/t/codemirror-6-set-indentation-unit/2972/3
    editorView = new EditorView({
        extensions: [breakpointGutter, basicSetup, readOnlyCompartment.of(readonly), python(), lineHighlightField, theme, indentUnit.of("    ")],
        parent: node
    });

    // const transaction = editorView.state.update({changes: {from: 0, to: editorView.state.doc.length, insert: initialText}});
    // editorView.dispatch(transaction);

    editorView.dispatch({changes: {from: 0, to: editorView.state.doc.length, insert: initialText}});

    return {
        destroy() {
            // the node has been removed from the DOM
        }
    };
}

</script>

<div id="codemirror-wrapper" use:editorAction></div>

<style>
    #codemirror-wrapper {
        /* display: flex;
        align-items: stretch; */
        width: 100%;
        /* height: 90%; */
        height: calc(100% - 30px);
        /* flex-basis: 80%;
        flex-grow: 1; */
    }
</style>