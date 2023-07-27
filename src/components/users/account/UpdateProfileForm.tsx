import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useSession, signIn } from 'next-auth/react'
import { toast } from 'react-toastify'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Input, TextArea } from '../../ui/form'
import useUserProfileCmd from '../../../js/hooks/useUserProfileCmd'

const validationSchema = z
  .object({
    displayName: z
      .string()
      .max(30, { message: 'You can\'t enter more than 30 characters.' })
      .optional().or(z.literal('')),
    bio: z
      .string()
      .max(80, { message: 'You can\'t enter more than 100 characters.' })
      .refine((text) => (text?.split(/\r\n|\r|\n/)?.length ?? 0) <= 3, { message: 'You can\'t enter more than 3 lines' })
      .optional().or(z.literal('')),
    website: z
      .string()
      .url('Please provide a valid web address.')
      .optional().or(z.literal(''))
  })

type ValidationSchema = z.infer<typeof validationSchema>

/**
 * A form for creating username (new user) or updating existing username.
 */
export const UpdateProfileForm: React.FC = () => {
  const session = useSession()

  const form = useForm<ValidationSchema>({
    mode: 'onChange',
    resolver: zodResolver(validationSchema)
  })
  const { handleSubmit, reset, formState: { isValid, isDirty, isSubmitting } } = form

  const { getUserPublicProfileByUuid, updatePublicProfileCmd } = useUserProfileCmd({ accessToken: session?.data?.accessToken as string })

  const userUuid = session.data?.user.metadata.uuid

  useEffect(() => {
    if (userUuid != null) {
      const doAsync = async (): Promise<void> => {
        const profile = await getUserPublicProfileByUuid(userUuid)
        if (profile != null) {
          const { displayName, bio, website } = profile
          reset({ displayName, bio, website })
        }
      }
      void doAsync()
    }
  }, [session])

  const submitHandler = async ({ displayName, bio, website }: ValidationSchema): Promise<void> => {
    if (userUuid == null) {
      // this shouldn't happend
      console.error('Unexpected error.  Submit button should have been disabled.')
      return
    }

    const successful = await updatePublicProfileCmd({ userUuid, displayName, bio, website })
    if (successful) {
      reset({ displayName, bio, website })
      toast.info('Username updated')
    } else {
      toast.error('Unexpected error.  Please try again.')
    }
  }

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      void signIn('auth0') // send users to Auth0 login screen
    }
  }, [session])

  useEffect(() => {
    const event = (e: Event): void => {
      if (isDirty) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', event)
    return () => window.removeEventListener('beforeunload', event)
  }, [isDirty])

  const shouldDisableSumit = !isValid || isSubmitting || !isDirty || userUuid == null
  return (
    <div className='w-full lg:max-w-md'>

      <h2 className=''>Edit Profile</h2>

      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className='mt-10 flex flex-col'
        >
          <Input
            name='displayName'
            label='Display name'
            spellCheck={false}
            placeholder='Mary Jane'
            helper='This could be your first name or a nickname. Spaces are allowed.'
          />

          <TextArea
            name='bio'
            label='Short bio'
            spellCheck
            placeholder='Something about you'
            helper='Let people know more about you.'
          />

          <Input
            name='website'
            label='Website'
            spellCheck={false}
            placeholder='https://example.com'
            helper='Your website.'
          />

          <button
            type='submit'
            disabled={shouldDisableSumit}
            className='mt-8 btn btn-primary btn-solid'
          >Save
          </button>
        </form>
      </FormProvider>
    </div>
  )
}
