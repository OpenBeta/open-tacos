import { useFormContext } from 'react-hook-form'
import clx from 'classnames'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'

import editorConfig from './editorConfig'
import onChange from './onChange'
import MyCustomAutoFocusPlugin from './plugins/MyInitialValuePlugin'

interface EditorProps {
  initialValue?: string
  editable?: boolean
  name: string
  reset: number
}

export default function Editor ({ initialValue = '', name, editable = false, reset }: EditorProps): JSX.Element {
  const { setValue } = useFormContext()

  const onChangeHandler = (arg0, arg1): void => {
    onChange(arg0, arg1, setValue, name)
  }

  return (
    <LexicalComposer initialConfig={editorConfig(initialValue, editable)}>
      <div className={clx('editor-container', editable ? 'bg-slate-200' : '')}>
        <RichTextPlugin
          contentEditable={<ContentEditable className='editor-input' />}
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin />
        <LinkPlugin />
        <OnChangePlugin onChange={onChangeHandler} ignoreSelectionChange />
        <HistoryPlugin />
        <MyCustomAutoFocusPlugin reset={reset} initialValue={initialValue} editable={editable} />
      </div>
    </LexicalComposer>
  )
}

function Placeholder (): JSX.Element {
  return <div className='editor-placeholder'>Enter some text...</div>
}

export const InplaceTextInput = ({ initialValue = '', name, editable = false, reset }: EditorProps): JSX.Element => {
  const { register, getValues } = useFormContext()

  const val = getValues(name)
  return editable ? <input id='editor' type='text' className='input' {...register(name)} /> : <div>{val}</div>
}
