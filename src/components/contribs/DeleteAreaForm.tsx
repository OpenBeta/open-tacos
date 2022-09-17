import { useForm, FormProvider } from 'react-hook-form'
import clx from 'classnames'
import { useMutation } from '@apollo/client'
import { signIn, useSession } from 'next-auth/react'

import { MUTATION_REMOVE_AREA, RemoveAreaReturnType, RemoveAreaProps } from '../../js/graphql/contribGQL'
import { SuccessAlert, ErrorAlert } from '../../pages/contribs/addArea'
import { graphqlClient } from '../../js/graphql/Client'
import Input from '../ui/form/Input'
import { useEffect } from 'react'

export interface Props {
  areaUuid: string
  areaName: string
}

interface HtmlFormProps {
  confirmation: string
}

export default function DeleteAreaForm ({ areaUuid, areaName }: Props): JSX.Element {
  const session = useSession()

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      void signIn('auth0') // send users to Auth0 login screen
    }
  }, [session])

  const [removeArea, { error, data }] = useMutation<{ removeArea: RemoveAreaReturnType }, RemoveAreaProps>(
    MUTATION_REMOVE_AREA, {
      client: graphqlClient,
      onCompleted: (data) => {
        void fetch(`/api/revalidate?a=${data.removeArea.uuid}`) // build new area page
      }
    }
  )

  // Form declaration
  const form = useForm<HtmlFormProps>(
    {
      mode: 'onBlur',
      defaultValues: { confirmation: '' }
    })

  const { handleSubmit, formState: { isSubmitSuccessful, isSubmitting }, reset } = form

  const submitHandler = async (): Promise<void> => {
    await removeArea({
      variables: {
        uuid: areaUuid
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
      <div>You're about to delete area <b>{areaName}</b>.  Type DELETE to confirm.</div>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Input
            label=''
            name='confirmation'
            registerOptions={{
              required: 'A confirmation is required.',
              validate: {
                confirm: (v: string): string | undefined => {
                  if (v === 'DELETE') return undefined
                  return 'Type DELETE in uppercase'
                }

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
          >Delete
          </button>
        </form>
      </FormProvider>
      {isSubmitSuccessful && error == null && data != null &&
        <SuccessAlert {...data.removeArea} onContinue={resetFormHandler} />}
      {error != null && <ErrorAlert {...error} />}
    </>
  )
}
