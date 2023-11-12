import { useCallback } from 'react'
import { $getRoot, EditorState } from 'lexical'
import { useController } from 'react-hook-form'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import { RulesType } from '@/js/types'

/**
 * Lexical plugin responsible for updating React-hook-form field
 */
export const ReactHookFormFieldPlugin: React.FC<{ fieldName: string, rules?: RulesType }> = ({ fieldName, rules }) => {
  const { field } = useController({ name: fieldName, rules })
  const [editor] = useLexicalComposerContext()
  const onChange = useCallback((editorState: EditorState): void => {
    editorState.read(() => {
      const str = $getRoot().getTextContent()
      console.log('#updating form')
      field.onChange(str)
    })
  }, [editor])
  return <OnChangePlugin onChange={onChange} />
}
