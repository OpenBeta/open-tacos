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
  // { /* md and wider screens: row, right-justify; mobile: column, center-justify */ }
  return (
    <div className='bg-base-100 flex justify-center flex-wrap-reverse lg:flex-nowrap gap-x-8 gap-y-4 px-4 lg:pr-0'>
      <button
        disabled={!isDirty}
        className={clx('bg-opacity-80 btn btn-md btn-link', isDirty ? '' : 'no-underline')} type='reset' onClick={() => {
          resetFn({ ...cache }, { keepValues: false })
          onReset()
        }}
      >
        Reset
      </button>
      <button
        type='submit'
        disabled={isSubmitting || !isDirty}
        className={clx('btn btn-primary btn-solid btn-md btn-block md:btn-wide', isSubmitting ? 'animate-pulse' : '')}
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </div>
  )
}
