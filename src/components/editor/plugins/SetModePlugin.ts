import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'

interface Props {
  editable: boolean
}
/**
 * React Lexical plugin to set preview/editable mode
 */
export function SetModePlugin ({ editable = false }: Props): any {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    if (editor != null) {
      editor.setEditable(editable)
    }
  }, [editable])

  return null
}
