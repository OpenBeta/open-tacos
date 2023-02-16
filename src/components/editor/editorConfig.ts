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

import DefaultTheme, { textInputTheme, csvTheme } from './themes/DefaultTheme'
import { $createInitialPlainTextState } from './plugins/PlainTextResetPlugin'
import { $createInitialState } from './plugins/CsvResetPlugin'
import { EditableClimbType } from '../crag/cragSummary'

/**
 * Create initial config object for rich text editor
 * @param initialValue
 * @param editable
 */
export const editorConfigRichText = (initialValue: string, editable: boolean): InitialConfigType => {
  const createInitial = (): void => {
    if (editable) {
      $createInitialPlainTextState(initialValue ?? '')
    } else {
      $convertFromMarkdownString(initialValue ?? '', TRANSFORMERS)
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

/**
 * Create initial config object for plain text editor
 * @param initialValue
 */
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

/**
 * Create initial config object for CSV editor
 * @param initialList initial climb list
 */
export const editorConfigCsv = (initialList: EditableClimbType[]): InitialConfigType => {
  return {
    editorState: () => $createInitialState(initialList),
    namespace: 'editor',
    theme: csvTheme,
    onError (error) {
      throw error
    },
    nodes: []
  }
}
