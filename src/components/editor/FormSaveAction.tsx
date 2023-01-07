import clx from 'classnames'
import { UseFormReset } from 'react-hook-form'

interface Props {
  editMode: boolean
  isDirty: boolean
  isSubmitting: boolean
  cache: any
  resetHookFn: UseFormReset<any>
  onReset: Function
}
/**
 * A reusable Reset and Save button bar to be used with react-hook-form
 */
export function FormSaveAction ({ editMode, isDirty, isSubmitting, cache, resetHookFn: resetFn, onReset }: Props): JSX.Element | null {
  if (!editMode) return null
  return (
    <div className='mt-8 flex justify-center md:justify-end flex-wrap-reverse gap-8'>
      {/* md and wider screen: row, right-justify; smaller: column, center-justify */}
      <button
        className={clx('btn btn-sm btn-link', isDirty ? '' : 'btn-disabled no-underline')} type='reset' onClick={() => {
          resetFn({ ...cache }, { keepValues: true })
          onReset()
        }}
      >
        Reset
      </button>
      <button
        type='submit'
        disabled={isSubmitting || !isDirty}
        className={clx('btn btn-primary btn-solid btn-sm btn-block md:btn-wide', isSubmitting ? 'animate-pulse' : '')}
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </div>
  )
}

// () => {
//     reset({ ...cache }, { keepValues: true })
//     setResetSignal(Date.now())
//   }
