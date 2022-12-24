import { useFormContext } from 'react-hook-form'

import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'

import editorConfig from './editorConfig'
import onChange from './onChange'
import MyCustomAutoFocusPlugin from './plugins/MyCustomAutoFocusPlugin'

interface EditorProps {
  initialValue?: string
  editable?: boolean
  name: string
}

export default function Editor ({ initialValue, name, editable = false }: EditorProps): JSX.Element {
  const { setValue } = useFormContext()

  const onChangeHandler = (arg0, arg1): void => {
    onChange(arg0, arg1, setValue, name)
  }
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className='editor-container'>
        <PlainTextPlugin
          contentEditable={<ContentEditable className='editor-input' />}
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={onChangeHandler} />
        <HistoryPlugin />
        <MyCustomAutoFocusPlugin initialValue={initialValue} editable={editable} />
      </div>
    </LexicalComposer>
  )
}

function Placeholder (): JSX.Element {
  return <div className='editor-placeholder'>Enter some text...</div>
}
// type EditorFormProps = EditorProps & {
//   name: string
// }
// export function EditorForm ({ name, initialValue, editable = false }: EditorFormProps): JSX.Element {
//   const { register } = useFormContext()
//   const { onChange } = register(name)
//   // props.
//   return <Editor initialValue={initialValue} editable={editable} onChange={onChange} />
// }
