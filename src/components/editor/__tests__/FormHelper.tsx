import { FormProvider, useForm } from 'react-hook-form'

export function FormHelper ({ initialValue, children, submitHandler }): JSX.Element {
  const form = useForm(
    {
      mode: 'onBlur',
      defaultValues: { title: initialValue }
    })

  const { handleSubmit } = form
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(submitHandler)}>
        {children}
        <button type='submit'>Submit</button>
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

  const { handleSubmit } = form
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(submitHandler)}>
        {children}
        <button type='submit'>Submit</button>
      </form>
    </FormProvider>
  )
}
it('Do nothing test to make jest happy', () => {})
