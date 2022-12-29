import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'

/**
 * Set editable mode for plain-text editor
 */
export function PlainTextModePlugin ({ editable }): null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    editor.setEditable(editable)
  }, [editable])

  return null
}
