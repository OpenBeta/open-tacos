'use client'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import clx from 'classnames'

import { mdeditorConfig } from './editorConfig'
import { ReactHookFormFieldPlugin } from './plugins/ReactHookFormFieldPlugin'
import { MarkdownPreviewPlugin } from './plugins/MarkdownPreviewPlugin'
import { RulesType } from '../../js/types'

export interface MarkdownEditorProps {
  initialValue?: string
  preview?: boolean
  fieldName: string
  reset: number
  placeholder?: string
  className?: string
  previewClassname?: string
  rules?: RulesType
}

/**
 * Multiline markdown editor with react-hook-form support.
 */
export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ fieldName, initialValue = '', preview = false, placeholder = 'Enter some text', rules, className, previewClassname }) => {
  const config = mdeditorConfig(initialValue, preview)
  return (
    <div className={clx(className, preview ? previewClassname : '')}>
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
              <PlainTextPlugin
                contentEditable={<ContentEditable className={config.theme?.input} data-lpignore='true' />}
                placeholder={<MDPlaceholder text={placeholder} className={config.theme?.placeholder} />}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <ReactHookFormFieldPlugin fieldName={fieldName} rules={rules} />
            </>
            )}
        <MarkdownPreviewPlugin editable={!preview} />
      </LexicalComposer>

    </div>

  )
}

const MDPlaceholder: React.FC<{ text: string, className: string }> = ({ text, className }) => {
  return <div className={className}>{text}</div>
}
