import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'
import { $createCodeNode } from '@lexical/code'
import { useFirstMountState } from 'react-use'

import { $getRoot, $createTextNode, createCommand, LexicalCommand, COMMAND_PRIORITY_EDITOR } from 'lexical'
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS
} from '@lexical/markdown'

export const RESET_EDITOR_CMD: LexicalCommand <null> = createCommand()

interface Props {
  initialValue: string
  editable: boolean
  reset: number
}
/**
 * React Lexical plugin to load initial value
 */
export default function MyInitialValuePlugin ({ initialValue, reset, editable = false }: Props): any {
  const [editor] = useLexicalComposerContext()
  const isFirstMount = useFirstMountState()

  /**
   * React to `editable` prop to set the editor in Preview or edit mode (editable = true).
   * In order to show raw markdown in edit we use the trick used in React Lexical playground to wrap
   * raw markdown in a 'code' node.
   * https://github.com/facebook/lexical/blob/06c3e6160cac44f1cdbe3113655bd8d00d1e3195/packages/lexical-playground/src/plugins/ActionsPlugin/index.tsx#L143
   */
  useEffect(() => {
    if (editor != null) {
      editor.update(() => {
        editor.setEditable(editable)
        if (isFirstMount) return
        const root = $getRoot()
        const firstChild = root.getFirstChild()

        if (editable) {
          // Edit mode: add raw markdown text to a 'markdown' or 'code' node
          const markdown = $convertToMarkdownString(TRANSFORMERS)
          root
            .clear()
            .append(
              $createCodeNode('markdown').append($createTextNode(markdown))
            )
        } else {
          // Preview mode: convert markdown content to Lexical state
          if (firstChild != null) {
            $convertFromMarkdownString(firstChild.getTextContent(), TRANSFORMERS)
          }
        }
        root.selectEnd()
      })
    }
  }, [editable])

  useEffect(() => {
    return editor.registerCommand(
      RESET_EDITOR_CMD,
      () => {
        if (initialValue != null) {
          $convertFromMarkdownString(initialValue, TRANSFORMERS)
        }
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  /**
   * React to a reset command (when reset prop changes)
   */
  useEffect(() => {
    if (reset === 0) return
    editor.dispatchCommand(RESET_EDITOR_CMD, null)
  }, [reset])

  return null
}
