'use client'
import { ReactNode } from 'react'
import { FieldValues, FormProvider, useForm, DefaultValues, ValidationMode } from 'react-hook-form'

export interface SingleEntryFormProps<T> {
  children: ReactNode
  initialValues: DefaultValues<T>
  validationMode?: keyof ValidationMode
  submitHandler: (formData: T) => Promise<void>
}

export function SingleEntryForm<T extends FieldValues> ({ children, initialValues, submitHandler, validationMode = 'onBlur' }: SingleEntryFormProps<T>): ReactNode {
  const form = useForm<T>({
    mode: validationMode,
    defaultValues: { ...initialValues }
  })

  const { handleSubmit, reset } = form

  return (
    <FormProvider {...form}>
      {/* eslint-disable-next-line */}
      <form onSubmit={handleSubmit(async data => {
        await submitHandler(data)
        reset() // clear isDirty flag
      }
      )}
      >
        {children}
      </form>
    </FormProvider>
  )
}
