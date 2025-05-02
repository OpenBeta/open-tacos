'use client'
import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { GraphQLError } from 'graphql'
import { signIn, useSession } from 'next-auth/react'
import useUpdateAreasCmd from '../../js/hooks/useUpdateAreasCmd'
import Input from '../ui/form/Input'
import useUpdateClimbsCmd from '@/js/hooks/useUpdateClimbsCmd'

interface DeleteFormProps {
  parentUuid: string
  uuid: string
  name: string
  returnToParentPageAfterDelete?: boolean
  isClimb?: boolean
  onSuccess?: () => void
  onError?: (error: GraphQLError) => void
}

interface HtmlFormProps {
  confirmation: string
}
/**
 * Delete area/climb dialog.  Users must be authenticated.
 * @param uuid ID of deleting area/climb
 * @param name Name of deleting area/climb
 * @param parentUuid ID of parent area (for redirection and revalidating SSG page purpose)
 * @param returnToParentPageAfterDelete true to be redirected to parent area page
 * @param onSuccess Optional callback
 */
export default function DeleteAreaAndClimbForm ({ uuid, name, parentUuid, returnToParentPageAfterDelete = false, isClimb = false, onSuccess }: DeleteFormProps): JSX.Element {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      void signIn('auth0') // send users to Auth0 login screen
    }
  }, [session])

  const onSuccessHandler = (): void => {
    router.refresh()
    if (onSuccess != null) {
      onSuccess()
    }
    if (returnToParentPageAfterDelete) {
      void router.replace('/crag/' + parentUuid)
    }
  }

  const { deleteClimbsCmd } = useUpdateClimbsCmd({
    parentId: parentUuid,
    accessToken: session.data?.accessToken as string ?? '',
    onDeleteCompleted: onSuccessHandler
  })

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
    try {
      if (isClimb) {
        await deleteClimbsCmd([uuid])
      } else {
        await deleteOneAreaCmd({ uuid })
      }
    } catch (error) {
      console.error('Error deleting climb/area:', error)
    }
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
      {/* eslint-disable-next-line */}
      <form onSubmit={handleSubmit(submitHandler)} className='dialog-form-default'>
        <div>You're about to delete '<span className='font-semibold'>{name}</span>'.  Type <b>DELETE</b> to confirm.</div>
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
          className='mt-4 btn btn-primary w-full'
          disabled={isSubmitting}
          type='submit'
        >{isSubmitting ? 'Deleting...' : 'Delete'}
        </button>
      </form>
    </FormProvider>
  )
}
