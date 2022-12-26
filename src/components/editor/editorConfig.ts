import { InitialConfigType } from '@lexical/react/LexicalComposer'
import {
  $convertFromMarkdownString,
  TRANSFORMERS
} from '@lexical/markdown'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { MarkNode } from '@lexical/mark'
import { CodeNode, $createCodeNode } from '@lexical/code'
import { $createTextNode, $getRoot } from 'lexical'

import ExampleTheme from './themes/ExampleTheme'

const editorConfig = (initialValue: string, editable: boolean): InitialConfigType => {
  const createInitial = (): void => {
    const root = $getRoot()
    if (editable) {
      root
        .clear()
        .append(
          $createCodeNode('markdown').append($createTextNode(initialValue))
        )
    } else {
      $convertFromMarkdownString(initialValue, TRANSFORMERS)
    }
  }

  return {
    editorState: createInitial,
    namespace: 'editor',
    theme: ExampleTheme,
    onError (error) {
      throw error
    },
    nodes: [MarkNode, HeadingNode, QuoteNode, LinkNode, ListNode, ListItemNode, CodeNode]
  }
}

export default editorConfig
