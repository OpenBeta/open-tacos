import { ReactNode } from 'react'
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form'

import { ClimbType } from '../../../js/types'

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
      <form>
        {children}
        <button
          disabled={!isValid} onClick={() => {
            console.log('##### submit')
            void handleSubmit(submitHandler)
          }}
        >Submit
        </button>
      </form>
    </FormProvider>
  )
}

interface CSVFormHelperProps {
  initialClimbs: ClimbType[]
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
      <form onSubmit={() => { void handleSubmit(submitHandler) }}>
        {children}
        <button type='submit' disabled={!isValid}>Submit</button>
      </form>
    </FormProvider>
  )
}
it('Do nothing test to make jest happy', () => {})
