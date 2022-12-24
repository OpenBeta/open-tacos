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
}
export default function Editor ({ initialValue }: EditorProps): JSX.Element {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className='editor-container'>
        <PlainTextPlugin
          contentEditable={<ContentEditable className='editor-input' />}
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={onChange} />
        <HistoryPlugin />
        <MyCustomAutoFocusPlugin initialValue={initialValue} />
      </div>
    </LexicalComposer>
  )
}

function Placeholder (): JSX.Element {
  return <div className='editor-placeholder text-base-300 italic'>Enter some text...</div>
}
