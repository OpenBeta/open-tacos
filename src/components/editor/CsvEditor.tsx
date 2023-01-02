import { useController } from 'react-hook-form'
import clx from 'classnames'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'

import { editorConfigCsv } from './editorConfig'
import onChange from './onChange'
// import { PlainTextResetPlugin } from './plugins/PlainTextResetPlugin'
import { ForceParagraphBreaks } from './plugins/ForceParagraphBreaks'
import { RulesType, ClimbType } from '../../js/types'

interface EditorProps {
  initialValue?: string
  editable?: boolean
  name: string
  reset: number
  placeholder?: string
  rules?: RulesType
  initialClimbs: ClimbType[]
}

export default function CsvEditor ({ initialClimbs, name, editable = false, reset, placeholder = 'Enter some text', rules }: EditorProps): JSX.Element {
  const { field, fieldState: { error } } = useController({ name, rules })

  const onChangeHandler = (arg0, arg1): void => {
    onChange(arg0, arg1, field, name)
  }
  return (
    <LexicalComposer initialConfig={editorConfigCsv(initialClimbs)}>
      <div className='form-control'>
        <div className={clx('editor-csv-container', editable ? 'bg-slate-200' : '')}>
          <RichTextPlugin
            contentEditable={<ContentEditable className='editor-csv-input' />}
            placeholder={<Placeholder text={placeholder} />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          {/* <ForceParagraphBreaks /> */}
          {/* <PlainTextPlugin
            contentEditable={<ContentEditable className='editor-input' />}
            placeholder={<Placeholder text={placeholder} />}
            ErrorBoundary={LexicalErrorBoundary}
          /> */}
          {/* <PlainTextResetPlugin
            initialValue=''
            editable={editable}
            resetSignal={reset}
          /> */}
          <OnChangePlugin onChange={onChangeHandler} ignoreSelectionChange />
          <HistoryPlugin />
        </div>
        <label className='label' id={`${name}-helper`} htmlFor={name}>
          {error?.message != null &&
           (<span className='label-text-alt text-error tracking-normal font-normal'>{error?.message}</span>)}
        </label>
      </div>
    </LexicalComposer>
  )
}

export function Placeholder ({ text }): JSX.Element {
  return <div className='editor-placeholder'>{text}</div>
}
