import { ReactNode } from 'react'
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form'

import { EditableClimbType } from '../../crag/cragSummary'

interface FormHelperProps {
  initialValue: string
  submitHandler: SubmitHandler<any>
  children: ReactNode
}

export const FormHelper: React.FC<FormHelperProps> = ({ initialValue, children, submitHandler }) => {
  const form = useForm(
    {
      mode: 'onBlur',
      defaultValues: { title: initialValue }
    })

  const { handleSubmit, formState: { isValid } } = form
  return (
    <FormProvider {...form}>
      {/* eslint-disable-next-line */}
      <form onSubmit={handleSubmit(submitHandler)}>
        {children}
        <button
          type='submit'
          disabled={!isValid}
        >Submit
        </button>
      </form>
    </FormProvider>
  )
}

interface CSVFormHelperProps {
  initialClimbs: EditableClimbType[]
  children: ReactNode
  submitHandler: () => void
}

export const CSVFormHelper: React.FC<CSVFormHelperProps> = ({ initialClimbs, children, submitHandler }) => {
  const form = useForm(
    {
      mode: 'onBlur',
      defaultValues: { climbs: initialClimbs }
    })

  const { handleSubmit, formState: { isValid } } = form
  return (
    <FormProvider {...form}>
      {/* eslint-disable-next-line */}
      <form onSubmit={handleSubmit(submitHandler)}>
        {children}
        <button type='submit' disabled={!isValid}>Submit</button>
      </form>
    </FormProvider>
  )
}
it('Do nothing test to make jest happy', () => {})
