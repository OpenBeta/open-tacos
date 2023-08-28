import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useRouter } from 'next/router'
import clx from 'classnames'
import { GraphQLError } from 'graphql'
import { signIn, useSession } from 'next-auth/react'
import useUpdateAreasCmd from '../../js/hooks/useUpdateAreasCmd'
import Input from '../ui/form/Input'

export interface DeleteAreaProps {
  parentUuid: string
  areaUuid: string
  areaName: string
  returnToParentPageAfterDelete?: boolean
  onSuccess?: () => void
  onError?: (error: GraphQLError) => void
}

interface HtmlFormProps {
  confirmation: string
}

/**
 * Delete area dialog.  Users must be authenticated.
 * @param areaUuid ID of deleting area
 * @param areaName Name of deleting area
 * @param parentUuid ID of parent area (for redirection and revalidating SSG page purpose)
 * @param returnToParentPageAfterDelete true to be redirected to parent area page
 * @param onSuccess Optional callback
 */
export default function DeleteAreaForm ({ areaUuid, areaName, parentUuid, returnToParentPageAfterDelete = true, onSuccess }: DeleteAreaProps): JSX.Element {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      void signIn('auth0') // send users to Auth0 login screen
    }
  }, [session])

  const onSuccessHandler = (): void => {
    if (onSuccess != null) {
      onSuccess()
    }
    if (returnToParentPageAfterDelete) {
      void router.replace('/crag/' + parentUuid)
      router.reload()
    }
  }

  const { deleteOneAreaCmd } = useUpdateAreasCmd({
    areaId: parentUuid,
    accessToken: session?.data?.accessToken as string ?? '',
    onDeleteCompleted: onSuccessHandler
  })

  // Form declaration
  const form = useForm<HtmlFormProps>(
    {
      mode: 'onSubmit',
      defaultValues: { confirmation: '' }
    })

  const { handleSubmit, setFocus, formState: { isSubmitting } } = form

  const submitHandler = async (): Promise<void> => {
    await deleteOneAreaCmd({ uuid: areaUuid })
  }

  if (session.status !== 'authenticated') {
    return (
      <div className='dialog-form-default'>Checking authorization...</div>
    )
  }

  useEffect(() => {
    setFocus('confirmation')
  }, [])

  return (
    <FormProvider {...form}>
      <form onSubmit={() => { void handleSubmit(submitHandler) }} className='dialog-form-default'>
        <div>You're about to delete '<span className='font-semibold'>{areaName}</span>'.  Type <b>DELETE</b> to confirm.</div>
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
  )
}
