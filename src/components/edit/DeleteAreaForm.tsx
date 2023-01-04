import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import clx from 'classnames'
import { useMutation } from '@apollo/client'
import { signIn, useSession } from 'next-auth/react'

import { MUTATION_REMOVE_AREA, RemoveAreaReturnType, RemoveAreaProps } from '../../js/graphql/gql/contribs'
import { graphqlClient } from '../../js/graphql/Client'
import Input from '../ui/form/Input'
import { SuccessAlert, AlertAction } from './alerts/Alerts'

export interface DeleteAreaProps {
  parentUuid: string
  areaUuid: string
  areaName: string
  onClose: (event: any) => void
}

interface HtmlFormProps {
  confirmation: string
}

export default function Form ({ areaUuid, areaName, parentUuid, onClose }: DeleteAreaProps): JSX.Element {
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
        void fetch(`/api/revalidate?a=${parentUuid}`) // build parent area page
      }
    }
  )

  // Form declaration
  const form = useForm<HtmlFormProps>(
    {
      mode: 'onBlur',
      defaultValues: { confirmation: '' }
    })

  const { handleSubmit, formState: { isSubmitSuccessful, isSubmitting } } = form

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

  if (session.status !== 'authenticated') {
    return (
      <div>Checking authorization...</div>
    )
  }
  return (
    <>
      <div>You're about to delete area <b>{areaName}</b>.  Type DELETE to confirm.</div>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(submitHandler)} className='dialog-form-default'>
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
        <DeleteSuccessAlert
          {...data.removeArea}
          parentUuid={parentUuid}
          onClose={onClose}
        />}
      {/* {error != null && <ErrorAlert {...error} />} */}
    </>
  )
}

interface DeleteSuccessAlertProps {
  parentUuid: string
  onClose: (event: any) => void
}
export const DeleteSuccessAlert = ({ areaName, parentUuid, onClose }: DeleteSuccessAlertProps & RemoveAreaReturnType): JSX.Element => (
  <SuccessAlert description={<span>Area <b>{areaName}</b> deleted.</span>}>
    <AlertAction className='btn btn-primary' onClick={onClose}>Continue</AlertAction>
  </SuccessAlert>)
