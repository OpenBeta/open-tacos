import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'

import { $getRoot, $createTextNode, $createParagraphNode } from 'lexical'

interface Props {
  initialValue: string
  editable: boolean
  resetSignal: number
}

/**
 * React Lexical plugin to response to preview/editable mode change
 */
export function PlainTextResetPlugin ({ initialValue, resetSignal, editable = false }: Props): any {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    if (!editable || resetSignal === 0) return
    editor.update(() =>
      $createInitialPlainTextState(initialValue)
    )
  }, [editor, editable, resetSignal])

  return null
}

export const $createInitialPlainTextState = (plainText: string): void => {
  const root = $getRoot()
  const paragraph = $createParagraphNode()
  paragraph.append(
    $createTextNode(plainText)
  )
  root.clear()
    .append(paragraph)
  root.selectEnd()
}
