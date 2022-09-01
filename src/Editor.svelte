<script lang="ts">
import {EditorView, basicSetup} from "codemirror"
import {python} from "@codemirror/lang-python"
import {lineHighlightField, addLineHighlight} from './lineMarkExtension';
import {currentLineNumber} from './interpreter';

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

let editorView: EditorView;

export function highlightLine(lineNo: number | null) {
    if (typeof lineNo === 'number') {
        const docPosition = editorView.state.doc.line(lineNo).from;
        editorView.dispatch({effects: addLineHighlight.of(docPosition)});
    } else {
        editorView.dispatch({effects: addLineHighlight.of(null)});
    }
}

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
    })
    editorView = new EditorView({
        extensions: [basicSetup, python(), lineHighlightField, theme],
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