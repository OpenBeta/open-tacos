import { useEffect } from 'react'
import { $getRoot } from 'lexical'
import { useController } from 'react-hook-form'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { RulesType } from '@/js/types'

/**
 * Lexical plugin responsible for updating React-hook-form field
 */
export const ReactHookFormFieldPlugin: React.FC<{ fieldName: string, rules?: RulesType }> = ({ fieldName, rules }) => {
  const { field } = useController({ name: fieldName, rules })
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    console.log('#RHF field plugin')
    editor.getEditorState().read(() => {
      const str = $getRoot().getTextContent()
      console.log('#updating form')
      field.onChange(str)
    })
  })
  return null
}
