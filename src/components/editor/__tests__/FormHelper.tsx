import { ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

interface FormHelperProps {
  initialValue: string // Replace 'string' with the actual type of initialValue
  submitHandler: (data: any) => void // Replace 'any' with the actual type of data expected by the submitHandler function
  children: ReactNode
}

export function FormHelper ({ initialValue, children, submitHandler }: FormHelperProps): JSX.Element {
  const form = useForm({
    mode: 'onBlur',
    defaultValues: { title: initialValue }
  })

  const { handleSubmit, formState: { isValid } } = form

  return (
    <FormProvider {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(submitHandler)
        }}
      >
        {children}
        <button type='submit' disabled={!isValid}>Submit</button>
      </form>
    </FormProvider>
  )
}

interface CSVFormHelperProps {
  initialClimbs: string[] // Replace 'string[]' with the actual type of initialClimbs
  submitHandler: (data: any) => void // Replace 'any' with the actual type of data expected by the submitHandler function
  children: ReactNode
}

export function CSVFormHelper ({ initialClimbs, children, submitHandler }: CSVFormHelperProps): JSX.Element {
  const form = useForm({
    mode: 'onBlur',
    defaultValues: { climbs: initialClimbs }
  })

  const { handleSubmit, formState: { isValid } } = form

  return (
    <FormProvider {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(submitHandler)
        }}
      >
        {children}
        <button type='submit' disabled={!isValid}>Submit</button>
      </form>
    </FormProvider>
  )
}

// Dummy test to make Jest happy
it('Do nothing test to make jest happy', () => {})
