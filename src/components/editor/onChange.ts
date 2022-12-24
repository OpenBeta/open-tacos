import { $getRoot, EditorState, LexicalEditor } from 'lexical'

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
export default function onChange (editorState: EditorState, editor: LexicalEditor, setValue, name): void {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const root = $getRoot()
    if (setValue != null) {
      setValue(name, root.getTextContent(), {
        shouldDirty: true
      })
    }
  })
}
