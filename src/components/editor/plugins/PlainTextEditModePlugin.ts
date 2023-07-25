import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'

interface Props {
  editable: boolean
}
/**
 * Set editable mode for plain-text editor
 */
export function PlainTextModePlugin ({ editable }: Props): null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    editor.setEditable(editable)
  }, [editable])

  return null
}
