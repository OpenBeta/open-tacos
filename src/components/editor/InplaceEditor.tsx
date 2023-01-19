import { useController } from 'react-hook-form'
import clx from 'classnames'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'

import { editorConfigRichText } from './editorConfig'
import onChange from './onChange'
import { MarkdownPreviewPlugin } from './plugins/MarkdownPreviewPlugin'
import { PlainTextResetPlugin } from './plugins/PlainTextResetPlugin'
import { RulesType } from '../../js/types'

interface EditorProps {
  initialValue?: string
  editable?: boolean
  name: string
  reset: number
  placeholder?: string
  rules?: RulesType
}

/**
 * Multiline inplace editor with react-hook-form support.
 */
export default function Editor ({ initialValue = '', name, editable = false, reset, placeholder = 'Enter some text', rules }: EditorProps): JSX.Element {
  const { field, fieldState: { error } } = useController({ name, rules })

  const onChangeHandler = (arg0, arg1): void => {
    onChange(arg0, arg1, field)
  }
  return (
    <LexicalComposer initialConfig={editorConfigRichText(initialValue, editable)}>
      <div className='form-control'>

        <div className={clx('editor-container', editable ? 'bg-slate-200' : '')}>
          {editable
            ? (
              <>
                <PlainTextPlugin
                  contentEditable={<ContentEditable className='editor-input' />}
                  placeholder={<Placeholder text={placeholder} />}
                  ErrorBoundary={LexicalErrorBoundary}
                />
                <PlainTextResetPlugin
                  initialValue={initialValue}
                  editable={editable}
                  resetSignal={reset}
                />
              </>
              )
            : (
              <>
                <RichTextPlugin
                  contentEditable={<ContentEditable className='editor-input' />}
                  placeholder={<Placeholder text={placeholder} />}
                  ErrorBoundary={LexicalErrorBoundary}
                />
                <ListPlugin />
                <LinkPlugin />
              </>)}

          <OnChangePlugin onChange={onChangeHandler} ignoreSelectionChange />
          <HistoryPlugin />
          <MarkdownPreviewPlugin editable={editable} />
        </div>
        <label className='label' id={`${name}-helper`} htmlFor={name}>
          {error?.message != null &&
           (<span className='label-text-alt text-error tracking-normal font-normal'>{error?.message}</span>)}
          {/* {(error == null) && helper} */}
        </label>
      </div>
    </LexicalComposer>
  )
}

export function Placeholder ({ text }): JSX.Element {
  return <div className='editor-placeholder'>{text}</div>
}
