import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'
import { useFirstMountState } from 'react-use'

import { $getRoot } from 'lexical'
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS
} from '@lexical/markdown'

import { $createInitialPlainTextState } from './PlainTextResetPlugin'

interface Props {
  editable: boolean
}

/**
 * React Lexical to support switching between markdown and preview mode
 */
export function MarkdownPreviewPlugin ({ editable = false }: Props): any {
  const [editor] = useLexicalComposerContext()
  const isFirstMount = useFirstMountState()

  /**
   * React to `editable` prop to set the editor in Preview or edit mode (editable = true).
   */
  useEffect(() => {
    if (editor != null) {
      editor.update(() => {
        editor.setEditable(editable)
        if (isFirstMount) return
        const root = $getRoot()

        if (editable) {
          // convert editor state to markdown
          const markdown = $convertToMarkdownString(TRANSFORMERS)
          $createInitialPlainTextState(markdown)
        } else {
          // Preview mode: convert markdown content to Lexical state
          $convertFromMarkdownString(root.getTextContent(), TRANSFORMERS)
        }
        root.selectEnd()
      })
    }
  }, [editable])

  return null
}
