import { useFormContext } from 'react-hook-form'
import clx from 'classnames'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'

import { editorConfigPlain } from './editorConfig'
import onChange from './onChange'
import { SetModePlugin } from './plugins/SetModePlugin'
import { SingleLinePlugin } from './plugins/SingleLinePlugin'
import { PlainTextResetPlugin } from './plugins/PlainTextResetPlugin'
import { Placeholder } from './InplaceEditor'
interface EditorProps {
  initialValue?: string
  editable?: boolean
  name: string
  reset: number
  placeholder?: string
}

export default function InplaceTextInput ({ initialValue = '', name, editable = false, reset, placeholder = 'Enter some text...' }: EditorProps): JSX.Element {
  const { setValue } = useFormContext()

  const onChangeHandler = (arg0, arg1): void => {
    onChange(arg0, arg1, setValue, name)
  }

  return (
    <LexicalComposer initialConfig={editorConfigPlain(initialValue)}>
      <div className={clx('editor-container', editable ? 'bg-slate-200' : '')}>
        <PlainTextPlugin
          contentEditable={<ContentEditable className='editor-input' />}
          placeholder={<Placeholder text={placeholder} />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <SetModePlugin editable={editable} />
        <SingleLinePlugin />
        <PlainTextResetPlugin initialValue={initialValue} editable={editable} resetSignal={reset} />
      </div>
    </LexicalComposer>
  )
}
