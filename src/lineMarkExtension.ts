// angelehnt an https://github.com/pamelafox/dis-this/blob/main/src/highlightable-editor.js#L57

import {StateField, StateEffect} from '@codemirror/state';
import {EditorView, Decoration, DecorationSet} from '@codemirror/view';

export const addLineHighlight = StateEffect.define<number | null>();
export const removeLineHighlight = StateEffect.define();

export const lineHighlightField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(lines, tr) {
    // console.log(tr)
    
    // lines = lines.map(tr.changes);
    // lines = Decoration.none;
    for (let e of tr.effects) {
      if (e.is(addLineHighlight) && typeof e.value === 'number') {
        lines = Decoration.none;
        lines = lines.update({add: [lineHighlightMark.range(e.value)]});
      } else if (e.is(removeLineHighlight)) {
        lines = Decoration.none;
      }
    }
    return lines;
  },
  provide: (f) => EditorView.decorations.from(f),
});

const lineHighlightMark = Decoration.line({
    attributes: {style: 'background-color: yellow'},
});