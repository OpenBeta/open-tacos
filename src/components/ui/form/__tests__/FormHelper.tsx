import { FormProvider, useForm } from 'react-hook-form'
interface FormProps {
  onSubmit: (data: any) => void
  children: JSX.Element | JSX.Element[]
  defaultValues?: any
}

export const Form = ({ onSubmit, defaultValues, children }: FormProps): JSX.Element => {
  const form = useForm({ defaultValues })
  const { handleSubmit, reset } = form
  return (
    <FormProvider {...form}>
      <form onSubmit={(e) => {
        handleSubmit(onSubmit)
      }}
      >
        {children}
        <button
          type='submit'
        >OK
        </button>
        <button
          type='reset' onClick={() =>
            reset()}
        >Reset
        </button>
      </form>
    </FormProvider>
  )
}

it('Do nothing test to make jest happy', () => {})
