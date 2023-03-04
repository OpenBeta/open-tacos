import { useController, useFieldArray, useFormContext } from 'react-hook-form'
import clx from 'classnames'
import type { EditorState, LexicalEditor } from 'lexical'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { XCircleIcon } from '@heroicons/react/20/solid'

import { editorConfigCsv } from './editorConfig'
import { onChangeCsv } from './onChange'
import { CsvResetPlugin } from './plugins/CsvResetPlugin'
import { RulesType } from '../../js/types'
import { EditableClimbType } from '../crag/cragSummary'
import type { GradeHelper } from '../../js/grades/Grade'

interface EditorProps {
  /** true edit mode is active */
  editable?: boolean
  /** Control name */
  name: string
  /** set this prop to a new value to trigger a reset */
  resetSignal: number
  /** React-hook-form validation rules */
  rules?: RulesType
  /** Default data for the field. Todo: Remove this props. Get default values from react-hook-form  */
  initialClimbs: EditableClimbType[]
  gradeHelper: GradeHelper
}

/**
 * Comma-separate-value editor aka the Power editor that enables bulk editting of multiple climbs.
 */
export default function CsvEditor ({ initialClimbs, name, editable = false, resetSignal, rules, gradeHelper }: EditorProps): JSX.Element {
  const { setError, clearErrors } = useFormContext()
  const { fieldState: { error } } = useController({ name })
  const { replace, fields } = useFieldArray({ name })

  const onChangeHandler = (editorState: EditorState, editor: LexicalEditor): void => {
    onChangeCsv(editorState, editor, replace, fields, gradeHelper, setError, clearErrors)
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
        <div className='absolute'>
          {fields?.map((entry, index) => {
            return (
              <div key={index} className='w-6 h-6'>
                {entry?.error != null && <XCircleIcon className='w-5 h-5 text-error' />}
              </div>
            )
          })}
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
