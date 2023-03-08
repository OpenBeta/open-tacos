import { FormProvider, useForm } from 'react-hook-form'

export function FormHelper ({ initialValue, children, submitHandler }): JSX.Element {
  const form = useForm(
    {
      mode: 'onBlur',
      defaultValues: { title: initialValue }
    })

  const { handleSubmit, formState: { isValid } } = form
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(submitHandler)}>
        {children}
        <button type='submit' disabled={!isValid}>Submit</button>
      </form>
    </FormProvider>
  )
}

export function CSVFormHelper ({ initialClimbs, children, submitHandler }): JSX.Element {
  const form = useForm(
    {
      mode: 'onBlur',
      defaultValues: { climbs: initialClimbs }
    })

  const { handleSubmit, formState: { isValid } } = form
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(submitHandler)}>
        {children}
        <button type='submit' disabled={!isValid}>Submit</button>
      </form>
    </FormProvider>
  )
}
it('Do nothing test to make jest happy', () => {})
