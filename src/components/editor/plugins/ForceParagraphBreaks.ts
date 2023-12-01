import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LineBreakNode, EditorState } from 'lexical'
import { useEffect } from 'react'

/**
 * In progress: Enforce a single line of text by removing new line characters (from enter key or copy-n-paste content)
 */
export function ForceParagraphBreaks (): null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    const lastRestoredEditorState: EditorState | null = null

    return editor.registerNodeTransform(LineBreakNode, (linebreakNode: LineBreakNode) => {
      console.log('#Break', linebreakNode)
      const prevEditorState = editor.getEditorState()
      if (
        lastRestoredEditorState !== prevEditorState
      ) {
        console.log('#onchange')
        // lastRestoredEditorState = prevEditorState
        // $restoreEditorState(editor, prevEditorState)
      }
      // const paragraph = $createParagraphNode()
      // paragraph.append(linebreakNode)
      // $getRoot().append(paragraph)
    })
  }, [editor])

  return null
}
