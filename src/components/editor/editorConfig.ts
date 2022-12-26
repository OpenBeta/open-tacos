import { InitialConfigType } from '@lexical/react/LexicalComposer'
import {
  $convertFromMarkdownString,
  TRANSFORMERS
} from '@lexical/markdown'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { MarkNode } from '@lexical/mark'
import { CodeNode } from '@lexical/code'

import DefaultTheme, { textInputTheme } from './themes/DefaultTheme'
import { $createInitialPlainTextState } from './plugins/PlainTextResetPlugin'

export const editorConfigRichText = (initialValue: string, editable: boolean): InitialConfigType => {
  const createInitial = (): void => {
    if (editable) {
      $createInitialPlainTextState(initialValue)
    } else {
      $convertFromMarkdownString(initialValue, TRANSFORMERS)
    }
  }

  return {
    editorState: createInitial,
    namespace: 'editor',
    theme: DefaultTheme,
    onError (error) {
      throw error
    },
    nodes: [MarkNode, HeadingNode, QuoteNode, LinkNode, ListNode, ListItemNode, CodeNode]
  }
}

export const editorConfigPlain = (initialValue: string): InitialConfigType => {
  return {
    editorState: () => $createInitialPlainTextState(initialValue),
    namespace: 'editor',
    theme: textInputTheme,
    onError (error) {
      throw error
    },
    nodes: []
  }
}
