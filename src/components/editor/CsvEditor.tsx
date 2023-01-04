import { useController, useFieldArray, useFormContext } from 'react-hook-form'
import clx from 'classnames'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'

import { editorConfigCsv } from './editorConfig'
import { onChangeCsv } from './onChange'
import { CsvResetPlugin } from './plugins/CsvResetPlugin'
import { RulesType } from '../../js/types'
import { EditableClimbType } from '../../components/crag/cragSummary'

interface EditorProps {
  initialValue?: string
  editable?: boolean
  name: string
  resetSignal: number
  rules?: RulesType
  initialClimbs: EditableClimbType[]
}

export default function CsvEditor ({ initialClimbs, name, editable = false, resetSignal, rules }: EditorProps): JSX.Element {
  const { setValue } = useFormContext()
  const { fieldState: { error } } = useController({ name, rules })
  const { replace, fields } = useFieldArray({ name, rules })
  const onChangeHandler = (arg0, arg1): void => {
    onChangeCsv(arg0, arg1, replace, fields, setValue)
  }
  return (
    <LexicalComposer initialConfig={editorConfigCsv(initialClimbs)}>
      <div className='form-control'>
        <div className={clx('editor-csv-container', editable ? 'bg-slate-200' : '')}>
          <RichTextPlugin
            contentEditable={<ContentEditable className='editor-csv-input' />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={onChangeHandler} ignoreSelectionChange />
          <HistoryPlugin />
          <CsvResetPlugin initialValue={initialClimbs} resetSignal={resetSignal} editable={editable} />
        </div>
        <label className='label' id={`${name}-helper`} htmlFor={name}>
          {error?.message != null &&
           (<span className='label-text-alt text-error tracking-normal font-normal'>{error?.message}</span>)}
        </label>
      </div>
    </LexicalComposer>
  )
}

export function Placeholder (): JSX.Element {
  return <div className='editor-csv-placeholder'>Climb one<br />Climb two</div>
}
