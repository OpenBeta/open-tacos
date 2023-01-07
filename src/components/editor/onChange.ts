import { EditorState, LexicalEditor, $getRoot } from 'lexical'
import { ControllerRenderProps } from 'react-hook-form'

export default function onChange (editorState: EditorState, editor: LexicalEditor, field: ControllerRenderProps, name: string): void {
  if (field?.onChange == null) return
  editorState.read(() => {
    const root = $getRoot()
    field?.onChange(root.getTextContent()?.trim())
  })
}
