// angelehnt an https://github.com/pamelafox/dis-this/blob/main/src/highlightable-editor.js#L57

import {StateField, StateEffect} from '@codemirror/state';
import {EditorView, Decoration} from '@codemirror/view';

export const addLineHighlight = StateEffect.define<number | null>();

export const lineHighlightField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(lines, tr) {
    // console.log(tr)
    
    // lines = lines.map(tr.changes);
    lines = Decoration.none;
    for (let e of tr.effects) {
      if (e.is(addLineHighlight) && typeof e.value === 'number') {        
        lines = lines.update({add: [lineHighlightMark.range(e.value)]});
      }
    }
    return lines;
  },
  provide: (f) => EditorView.decorations.from(f),
});

const lineHighlightMark = Decoration.line({
    attributes: {style: 'background-color: yellow'},
});