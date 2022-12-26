import { EditorState, LexicalEditor, $getRoot } from 'lexical'
import { UseFormSetValue, FieldValues } from 'react-hook-form'

export default function onChange (editorState: EditorState, editor: LexicalEditor, setValue: UseFormSetValue<FieldValues>, name: string): void {
  editorState.read(() => {
    if (setValue != null) {
      const root = $getRoot()
      setValue(name, root.getTextContent(), {
        shouldDirty: true
      })
    }
  })
}
