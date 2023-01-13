import { useEffect, useState, useRef } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useRouter } from 'next/router'
import clx from 'classnames'
import { useMutation } from '@apollo/client'
import { signIn, useSession } from 'next-auth/react'

import { MUTATION_REMOVE_AREA, RemoveAreaReturnType, RemoveAreaProps } from '../../js/graphql/gql/contribs'
import { graphqlClient } from '../../js/graphql/Client'
import Input from '../ui/form/Input'
import Toast from '../ui/Toast'
import { MobileDialog, DialogContent, DialogTrigger } from '../ui/MobileDialog'

export interface DeleteAreaProps {
  parentUuid: string
  areaUuid: string
  areaName: string
  onSuccess?: () => void
  onError?: (error) => void
}

interface HtmlFormProps {
  confirmation: string
}

export default function DeleteAreaForm ({ areaUuid, areaName, parentUuid, onSuccess, onError }: DeleteAreaProps): JSX.Element {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      void signIn('auth0') // send users to Auth0 login screen
    }
  }, [session])

  // TODO: move this to useUpdateAreasCmd hook
  const [removeArea] = useMutation<{ removeArea: RemoveAreaReturnType }, RemoveAreaProps>(
    MUTATION_REMOVE_AREA, {
      client: graphqlClient,
      onCompleted: async (data) => {
        if (onSuccess != null) {
          onSuccess()
        }
        void fetch(`/api/revalidate?a=${parentUuid}`) // rebuild parent area page
        await router.replace('/areas/' + parentUuid)
        router.reload()
      },
      onError
    }
  )

  // Form declaration
  const form = useForm<HtmlFormProps>(
    {
      mode: 'onBlur',
      defaultValues: { confirmation: '' }
    })

  const { handleSubmit, formState: { isSubmitting } } = form

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
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(submitHandler)} className='dialog-form-default'>
          <div>You're about to delete <b>{areaName}</b>.  Type DELETE to confirm.</div>
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
    </>
  )
}

export const DeleteAreaTrigger = ({ areaName, areaUuid, parentUuid, disabled }: DeleteAreaProps & { disabled: boolean}): JSX.Element => {
  const toastRef = useRef<any>()

  const [isOpen, setOpen] = useState(false)
  const onSuccess = (): void => {
    setOpen(false)
    toastRef?.current?.publish(`Area '${areaName}' deleted.`)
  }
  return (
    <>
      <MobileDialog modal open={isOpen} onOpenChange={setOpen}>
        <DialogTrigger className='btn btn-primart btn-sm btn-outline px-6' disabled={disabled}>Delete</DialogTrigger>
        <DialogContent title='Delete area'>
          <DeleteAreaForm
            areaName={areaName}
            areaUuid={areaUuid}
            parentUuid={parentUuid}
            onSuccess={onSuccess}
          />
        </DialogContent>
      </MobileDialog>
      <Toast ref={toastRef} />
    </>
  )
}
