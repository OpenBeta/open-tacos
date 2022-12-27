import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'
import { $getRoot } from 'lexical'
import { $convertFromMarkdownString, $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown'
import { useFirstMountState } from 'react-use'
import { $createInitialPlainTextState } from './PlainTextResetPlugin'

interface Props {
  editable: boolean
}

/**
 * React Lexical plugin to support switching between markdown and preview mode
 */
export function MarkdownPreviewPlugin ({ editable = false }: Props): any {
  const [editor] = useLexicalComposerContext()
  const isFirstMount = useFirstMountState()
  useEffect(() => {
    editor.update(() => {
      editor.setEditable(editable)
      if (isFirstMount) return // skip on first mount because initial state is set in editorConfig.ts
      if (editable) {
        // convert editor's current state to markdown
        const markdown = $convertToMarkdownString(TRANSFORMERS)
        $createInitialPlainTextState(markdown)
      } else {
        // Preview mode: convert markdown content to Lexical state
        $convertFromMarkdownString($getRoot().getTextContent(), TRANSFORMERS)
      }
    })
  }, [editable])

  return null
}
