import { EditorState, LexicalEditor, $getRoot } from 'lexical'

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
export default function onChange (editorState: EditorState, editor: LexicalEditor, setValue, name): void {
  editorState.read(() => {
    if (setValue != null) {
      const root = $getRoot()
      const first = root.getFirstChild()
      // set react-hook-form value
      setValue(name, first?.getTextContent(), {
        shouldDirty: true
      })
    }
  })
}
