import { FormProvider, useForm } from 'react-hook-form'

interface FormProps {
  onSubmit: (data) => void
  children: JSX.Element | JSX.Element[]
  defaultValues?: any
}

export const Form = ({ onSubmit, defaultValues, children }: FormProps): JSX.Element => {
  const form = useForm({ defaultValues })
  const { handleSubmit } = form
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  )
}

it('Do nothing test to make jest happy', () => {})
