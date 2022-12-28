import { useFormContext } from 'react-hook-form'
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

interface EditorProps {
  initialValue?: string
  editable?: boolean
  name: string
  reset: number
  placeholder?: string
}

export default function Editor ({ initialValue = '', name, editable = false, reset, placeholder = 'Enter some text' }: EditorProps): JSX.Element {
  const { setValue } = useFormContext()

  const onChangeHandler = (arg0, arg1): void => {
    onChange(arg0, arg1, setValue, name)
  }

  return (
    <LexicalComposer initialConfig={editorConfigRichText(initialValue, editable)}>
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
    </LexicalComposer>
  )
}

export function Placeholder ({ text }): JSX.Element {
  return <div className='editor-placeholder'>{text}</div>
}
