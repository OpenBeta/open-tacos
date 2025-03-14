'use client'
import { ReactNode } from 'react'
import { FieldValues, FormProvider, useForm, DefaultValues, ValidationMode } from 'react-hook-form'
import { SpinnerGap } from '@phosphor-icons/react/dist/ssr'
import clx from 'classnames'

export interface SingleEntryFormProps<T> {
  children: ReactNode
  initialValues?: DefaultValues<T>
  validationMode?: keyof ValidationMode
  alwaysEnableSubmit?: boolean
  submitHandler: (formData: T) => Promise<void> | void
  title: string
  helperText?: string
  keepValuesAfterReset?: boolean
  className?: string
}

/**
 * A form container for abstracting away the react-hook-form  boilerplate.
 * @param ignoreIsValid If true, the submit button will always be enabled.
 */
export function SingleEntryForm<T extends FieldValues> ({
  children,
  initialValues,
  submitHandler,
  validationMode = 'onBlur',
  alwaysEnableSubmit = false,
  helperText,
  title,
  keepValuesAfterReset = true,
  className = ''
}: SingleEntryFormProps<T>): ReactNode {
  const form = useForm<T>({
    mode: validationMode,
    ...initialValues != null && { defaultValues: { ...initialValues } }
  })

  const { handleSubmit, reset, formState: { isValid, isSubmitting, isDirty } } = form

  return (
    <FormProvider {...form}>
      {/* eslint-disable-next-line */}
      <form onSubmit={handleSubmit(async data => {
        await submitHandler(data)
        if (keepValuesAfterReset) {
          reset({ ...data })
        } else {
          reset()
        }
      })}
      >
        <div className={clx('card card-bordered border-base-300/40 overflow-hidden w-full bg-base-100', className)}>
          <div className='card-body'>
            <h4 className='font-semibold text-2xl'>{title}</h4>
            <div className='pt-2 flex flex-col gap-y-4'>
              {children}
            </div>
          </div>
          <div className='px-8 py-2 w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-base-200 border-t'>
            <span className='text-base-content/50'>{helperText}</span>
            <SubmitButton
              isSubmitting={isSubmitting}
              isDirty={alwaysEnableSubmit ? true : isDirty}
              isValid={alwaysEnableSubmit ? true : isValid}
            />
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export const SubmitButton: React.FC<{ isValid: boolean, isSubmitting: boolean, isDirty: boolean }> = ({
  isValid, isSubmitting, isDirty
}) => (
  <button
    className='btn btn-primary btn-solid w-full lg:w-fit'
    disabled={!isValid || isSubmitting || !isDirty}
    type='submit'
  >
    {isSubmitting && <SpinnerGap size={24} className='animate-spin' />} Save
  </button>
)
