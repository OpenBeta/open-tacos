'use client'
import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useSession, signIn } from 'next-auth/react'
import { toast } from 'react-toastify'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr'

import { Input, TextArea } from '../../ui/form'
import useUserProfileCmd from '../../../js/hooks/useUserProfileCmd'
import { BaseProfilePhotoUploader } from '../../media/BaseUploader'
import { ProfileImage } from '../PublicProfile'
import { useUserGalleryStore } from '../../../js/stores/useUserGalleryStore'

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

  const setAvatarUrl = useUserGalleryStore(store => store.setAvatarUrl)
  const avatarUrl = useUserGalleryStore(store => store.avatarUrl)

  useEffect(() => {
    if (userUuid != null) {
      const doAsync = async (): Promise<void> => {
        const profile = await getUserPublicProfileByUuid(userUuid)
        if (profile != null) {
          const { displayName, bio, website, avatar } = profile
          reset({ displayName, bio, website })
          if (avatar != null) {
            setAvatarUrl(avatar)
          }
        }
      }
      void doAsync()
    }
  }, [userUuid])

  const submitHandler = async ({ displayName, bio, website }: ValidationSchema): Promise<void> => {
    if (userUuid == null) {
      // this shouldn't happend
      console.error('Unexpected error.  Submit button should have been disabled.')
      return
    }

    const successful = await updatePublicProfileCmd({ userUuid, displayName, bio, website })
    if (successful) {
      reset({ displayName, bio, website })
      toast.info('Profile updated')
    } else {
      toast.error('Unexpected error.  Please try again.')
    }
  }

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      void signIn('auth0') // send users to Auth0 login screen
    }
  }, [session.status])

  useEffect(() => {
    const event = (e: Event): void => {
      if (isDirty) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', event)
    return () => window.removeEventListener('beforeunload', event)
  }, [isDirty])

  const shouldDisableSubmit = !isValid || isSubmitting || !isDirty || userUuid == null
  return (
    <div className='w-full lg:max-w-md'>

      <h2 className='text-2xl font-bold mb-8'>Edit Profile</h2>

      {avatarUrl !== null && avatarUrl !== '' && <EditProfileImage avatar={avatarUrl} key={avatarUrl} />}

      <FormProvider {...form}>
        {/* eslint-disable-next-line */}
        <form onSubmit={handleSubmit(submitHandler)} className='flex flex-col gap-y-4'>
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
            disabled={shouldDisableSubmit}
            className='mt-6 btn btn-primary btn-solid btn-block md:btn-wide'
          >Save changes
          </button>
        </form>
      </FormProvider>
    </div>
  )
}

export const EditProfileImage = ({ avatar }: { avatar: string }): JSX.Element => {
  return (
    <div className='relative inline-block mb-6'>
      <BaseProfilePhotoUploader className='absolute bottom-1 right-1 bg-gray-800 bg-opacity-75 p-2 rounded-full transition-opacity duration-200 hover:bg-opacity-100 hover:scale-110 z-10 cursor-pointer'>
        <PencilSimpleIcon color='#FFFFFF' size={20} />
      </BaseProfilePhotoUploader>
      <ProfileImage avatar={avatar} />
    </div>
  )
}
