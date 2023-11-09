import { useEffect } from 'react'
import { $getRoot } from 'lexical'
import { useController } from 'react-hook-form'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

export const ReactHookFormFieldPlugin: React.FC<{ fieldName: string }> = ({ fieldName }) => {
  const { field } = useController({ name: fieldName })
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    editor.getEditorState().read(() => {
      const str = $getRoot().getTextContent()
      field.onChange(str)
    })
  })
  return null
}
