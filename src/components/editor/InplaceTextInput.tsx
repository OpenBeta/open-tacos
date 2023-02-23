import { useController } from 'react-hook-form'
import clx from 'classnames'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'

import { editorConfigPlain } from './editorConfig'
import onChange from './onChange'
import { SingleLinePlugin } from './plugins/SingleLinePlugin'
import { PlainTextResetPlugin } from './plugins/PlainTextResetPlugin'
import { PlainTextModePlugin } from './plugins/PlainTextEditModePlugin'
import { Placeholder } from './InplaceEditor'
import { RulesType } from '../../js/types'

interface EditorProps {
  initialValue?: string
  editable?: boolean
  name: string
  reset: number
  placeholder?: string
  className?: string
  rules?: RulesType
  helperText?: JSX.Element | JSX.Element[] | string
}

/**
 * A single-line inplace editor that behaves like a react-hook-form input field.  Support validation rules and error label.
 */
export default function InplaceTextInput ({ initialValue = '', name, editable = false, reset, placeholder = 'Enter some text...', className = '', rules, helperText }: EditorProps): JSX.Element {
  const { field, fieldState: { error } } = useController({ name, rules })
  const { onBlur } = field

  const onChangeHandler = (arg0, arg1): void => {
    onChange(arg0, arg1, field)
  }

  return (
    <LexicalComposer initialConfig={editorConfigPlain(initialValue)}>
      <div className='form-control'>
        <div
          className={clx('editor-container', className, editable ? 'bg-slate-200' : '')}
          onBlur={onBlur}
        >
          <PlainTextPlugin
            contentEditable={<ContentEditable className='editor-input' />}
            placeholder={<Placeholder text={placeholder} />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <SingleLinePlugin />
          <OnChangePlugin onChange={onChangeHandler} ignoreSelectionChange />
          <PlainTextResetPlugin initialValue={initialValue} editable={editable} resetSignal={reset} />
          <PlainTextModePlugin editable={editable} />
        </div>
        <label className='label' id={`${name}-helper`} htmlFor={name}>
          {error?.message != null &&
           (<span className='label-text-alt text-error tracking-normal font-normal'>{error?.message}</span>)}
          {error?.message == null && helperText}
        </label>
      </div>
    </LexicalComposer>
  )
}
