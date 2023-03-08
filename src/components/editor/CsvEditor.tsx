import { useFieldArray } from 'react-hook-form'
import clx from 'classnames'
import type { EditorState, LexicalEditor } from 'lexical'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { BugAntIcon } from '@heroicons/react/20/solid'

import { editorConfigCsv } from './editorConfig'
import { onChangeCsv } from './onChange'
import { CsvResetPlugin } from './plugins/CsvResetPlugin'
import { RulesType } from '../../js/types'
import { EditableClimbType } from '../crag/cragSummary'
import type { GradeHelper } from '../../js/grades/Grade'
import Tooltip from '../ui/Tooltip'

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
export default function CsvEditor ({ initialClimbs, name, editable = false, resetSignal, gradeHelper }: EditorProps): JSX.Element {
  const { replace, fields } = useFieldArray({ name, rules: gradeHelper.getBulkValidationRules() })

  const onChangeHandler = (editorState: EditorState, editor: LexicalEditor): void => {
    onChangeCsv(editorState, editor, replace, fields, gradeHelper)
  }

  // A more reliable way to check for errors when using react-hook-form field array
  const thereAreErrors = fields.some(
    (entry: EditableClimbType) => Object.values(entry.errors ?? {}).filter(v => v != null).length > 0)

  return (
    <LexicalComposer initialConfig={editorConfigCsv(initialClimbs)}>
      <div className='form-control'>
        <div className={clx('editor-csv-container', editable ? 'bg-slate-200' : '')}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className='editor-csv-input'
              />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={onChangeHandler} ignoreSelectionChange />
          <HistoryPlugin />
          <CsvResetPlugin initialValue={initialClimbs} resetSignal={resetSignal} editable={editable} />
        </div>
        <BugHighlighter fields={fields as EditableClimbType[]} />
        <label className='label ml-12' id={`${name}-helper`} htmlFor={name}>
          {thereAreErrors &&
           (<span className='label-text-alt text-error tracking-normal font-normal'>Please fix formatting errors</span>)}
        </label>
      </div>
    </LexicalComposer>
  )
}

export function Placeholder (): JSX.Element {
  return <div className='editor-csv-placeholder'>Climb one<br />Climb two</div>
}

interface BugHighlighterProps {
  fields: EditableClimbType[]
}

/**
 * Highline the erroneous line
 */
const BugHighlighter: React.FC<BugHighlighterProps> = ({ fields }) => {
  return (
    <div className='absolute'>
      {fields?.map((entry, index) => {
        const errorMsgs = Object.values(entry?.errors ?? {}).filter(k => k != null)
        const el = document.querySelector(`div.editor-csv-input>p:nth-child(${index + 1})`)
        if (el != null) {
          // THIS IS A HACK!
          // there may be a better way to tap into Lexical node renderer and style the offending line
          if (errorMsgs.length > 0) {
            el.className = 'editor-csv-paragraph ltr bg-opacity-30 bg-error'
          } else {
            el.className = 'editor-csv-paragraph ltr'
          }
        }
        return (
          <Tooltip
            key={index} content={<>{errorMsgs.map((s, index) => <div key={index}>· {s}</div>)}</>}
            className='ml-0.5 h-7 flex justify-center items-center'
          >
            {errorMsgs.length > 0 ? <BugAntIcon className='w-4 h-4 text-error' /> : null}
          </Tooltip>
        )
      }
      )}
    </div>
  )
}
