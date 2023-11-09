'use client'
import { ReactNode, useState } from 'react'
import { FieldValues, FormProvider, useForm, DefaultValues } from 'react-hook-form'
import { PencilIcon } from '@heroicons/react/24/outline'
import { AREA_NAME_FORM_VALIDATION_RULES } from '@/components/edit/EditAreaForm'

import { InplaceTextInput } from '@/components/editor'
import { Input } from '@/components/ui/form'

export interface SingleEntryFormProps<T> {
  children: ReactNode
  initialValues: DefaultValues<T>
  submitHandler: (formData: T) => void
}

export function SingleEntryForm<T extends FieldValues> ({ children, initialValues, submitHandler }: SingleEntryFormProps<T>): ReactNode {
  const form = useForm<T>({
    mode: 'onBlur',
    defaultValues: { ...initialValues }
  })

  const { handleSubmit } = form

  return (
    <FormProvider {...form}>
      {/* eslint-disable-next-line */}
      <form onSubmit={handleSubmit(submitHandler)}>
        {children}
      </form>
    </FormProvider>
  )
}
