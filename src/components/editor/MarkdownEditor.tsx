'use client'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'

import { mdeditorConfig } from './editorConfig'
import { MarkdownPreviewPlugin } from './plugins/MarkdownPreviewPlugin'
import { PlainTextResetPlugin } from './plugins/PlainTextResetPlugin'
import { ReactHookFormFieldPlugin } from './plugins/ReactHookFormFieldPlugin'
import { RulesType } from '../../js/types'

export interface MarkdownEditorProps {
  initialValue?: string
  preview?: boolean
  fieldName: string
  reset: number
  placeholder?: string
  rules?: RulesType
}

/**
 * Multiline inplace editor with react-hook-form support.
 */
export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ fieldName, initialValue = '', preview = false, reset, placeholder = 'Enter some text', rules }) => {
  // const { field, fieldState: { error } } = useController({ name: fieldName, rules })

  // const onChangeHandler = (arg0: EditorState, arg1: LexicalEditor): void => {
  //   onChange(arg0, arg1, field)
  // }
  const config = mdeditorConfig(initialValue, !preview)
  return (
    <div className='relative border'>
      <LexicalComposer initialConfig={config}>
        {preview
          ? (
            <>
              <RichTextPlugin
                contentEditable={<ContentEditable data-lpignore='true' className={config.theme?.input} />}
                placeholder={<MDPlaceholder text='Nothing to preview' className={config.theme?.placeholder} />}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <ListPlugin />
              <LinkPlugin />
            </>
            )
          : (
            <>
              <AutoFocusPlugin />
              <PlainTextPlugin
                contentEditable={<ContentEditable className={config.theme?.input} data-lpignore='true' />}
                placeholder={<MDPlaceholder text={placeholder} className={config.theme?.placeholder} />}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <PlainTextResetPlugin
                initialValue={initialValue}
                editable={!preview}
                resetSignal={reset}
              />
              <ReactHookFormFieldPlugin fieldName={fieldName} rules={rules} />
            </>
            )}

        <HistoryPlugin />
        <MarkdownPreviewPlugin editable={!preview} />
      </LexicalComposer>
    </div>

  )
}

const MDPlaceholder: React.FC<{ text: string, className: string }> = ({ text, className }) => {
  return <div className={className}>{text}</div>
}
