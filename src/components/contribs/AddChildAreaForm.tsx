import { useForm, FormProvider } from 'react-hook-form'
import clx from 'classnames'
import { useMutation } from '@apollo/client'
import { signIn, useSession } from 'next-auth/react'

import { MUTATION_ADD_AREA, AddAreaReturnType, AddAreaProps } from '../../js/graphql/contribGQL'
import { SuccessAlert, ErrorAlert } from '../../pages/contribs/addArea'
import { graphqlClient } from '../../js/graphql/Client'
import Input from '../ui/form/Input'
import { useEffect } from 'react'

export interface ChildAreaBaseProps {
  parentUuid: string
  parentName: string
}

interface NewAreaFormProps extends ChildAreaBaseProps {
  newAreaName: string
  shortCode: string

}

export default function AddChildAreaForm ({ parentUuid, parentName }: ChildAreaBaseProps): JSX.Element {
  const session = useSession()

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      void signIn('auth0') // send users to Auth0 login screen
    }
  }, [session])

  const [addArea, { error, data }] = useMutation<{ addArea: AddAreaReturnType }, AddAreaProps>(
    MUTATION_ADD_AREA, {
      client: graphqlClient,
      onCompleted: (data) => {
        void fetch(`/api/revalidate?a=${data.addArea.uuid}`) // build new area page
        void fetch(`/api/revalidate?a=${parentUuid}`) // rebuild parent page
      }
    }
  )

  // Form declaration
  const form = useForm<NewAreaFormProps>(
    {
      mode: 'onBlur',
      defaultValues: { newAreaName: '', shortCode: '', parentName: parentName }
    })

  const { handleSubmit, formState: { isSubmitSuccessful, isSubmitting }, reset } = form

  const submitHandler = async ({ newAreaName }: NewAreaFormProps): Promise<void> => {
    await addArea({
      variables: {
        name: newAreaName,
        parentUuid: parentUuid,
        countryCode: null
      },
      context: {
        headers: {
          authorization: `Bearer ${session?.data?.accessToken as string ?? ''}`
        }
      }
    })
  }

  const resetFormHandler = (): void => {
    reset()
  }

  if (session.status !== 'authenticated') {
    return (
      <div>Checking authorization...</div>
    )
  }
  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Input
            label='Parent:'
            name='parentName'
            className='input input-bordered input-md'
            readOnly
          />
          <Input
            label='Name: *'
            name='newAreaName'
            placeholder='New area name'
            registerOptions={{
              required: 'Name is required.',
              minLength: {
                value: 2,
                message: 'Minimum 2 characters'
              },
              maxLength: {
                value: 120,
                message: 'Maxium 120 characters'
              }
            }}
            className='input input-primary input-bordered input-md'
          />
          <button
            className={
            clx('mt-4 btn btn-primary w-full',
              isSubmitting ? 'loading btn-disabled' : ''
            )
          }
            type='submit'
          >Add area
          </button>
        </form>
      </FormProvider>
      {isSubmitSuccessful && error == null && data != null &&
        <SuccessAlert {...data.addArea} onContinue={resetFormHandler} />}
      {error != null && <ErrorAlert {...error} />}
    </>
  )
}
