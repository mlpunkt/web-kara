// angelehnt an https://github.com/pamelafox/dis-this/blob/main/src/highlightable-editor.js#L57

import {StateField, StateEffect} from '@codemirror/state';
import {EditorView, Decoration} from '@codemirror/view';

export const addLineHighlight = StateEffect.define<number>();

export const lineHighlightField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(lines, tr) {
    lines = lines.map(tr.changes);
    for (let e of tr.effects) {
      if (e.is(addLineHighlight)) {
        lines = Decoration.none;
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

