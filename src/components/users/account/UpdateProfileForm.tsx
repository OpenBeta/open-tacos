import { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { QuestionMarkCircleIcon, ArrowLeftCircleIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Input, TextArea } from '../../ui/form'
import useUserProfileCmd from '../../../js/hooks/useUserProfileCmd'
import Tooltip from '../../ui/Tooltip'
import { UserPublicProfile } from '../../../js/types/User'

const validationSchema = z
  .object({
    displayName: z
      .string()
      .max(30, { message: 'You can\'t enter more than 30 characters.' }),
    bio: z
      .string()
      .max(80, { message: 'You can\'t enter more than 100 characters.' })
      .refine((text) => (text?.split(/\r\n|\r|\n/)?.length ?? 0) <= 3, { message: 'You can\'t enter more than 3 lines' }),
    website: z
      .string()
      .url('Please provide a valid web address.')
  })

type ValidationSchema = z.infer<typeof validationSchema>

/**
 * A form for creating username (new user) or updating existing username.
 */
export const UpdateProfileForm: React.FC = () => {
  const session = useSession()
  const [publicProfile, setPublicProfile] = useState<UserPublicProfile>()

  const { getUserPublicProfileByUuid } = useUserProfileCmd({ accessToken: session?.data?.accessToken as string })

  useEffect(() => {
    const userUuid = session.data?.user.metadata.uuid
    console.log('#user uid', userUuid)
    if (userUuid != null) {
      const doAsync = async (): Promise<void> => {
        const profile = await getUserPublicProfileByUuid(userUuid)
        console.log('# profile', profile)
        if (profile != null) {
          setPublicProfile(profile)
        }
      }
      void doAsync()
    }
  }, [session])

  const form = useForm<ValidationSchema>({
    mode: 'onChange',
    defaultValues: {
      displayName: publicProfile?.displayName,
      bio: publicProfile?.bio,
      website: publicProfile?.website
    },
    resolver: zodResolver(validationSchema)
  })

  const { handleSubmit, reset, formState: { isValid, isDirty, isSubmitting, isSubmitSuccessful } } = form

  const submitHandler = async ({ displayName, bio }: ValidationSchema): Promise<void> => {
    if (userUuid == null) {
      return
    }
    try {
      // await updateUsername({
      //   userUuid,
      //   username,
      //   ...isNewUser && email != null && { email }, // email is required for new users
      //   ...isNewUser && avatar != null && { avatar } // get Auth0 avatar for new users
      // })
      toast.info('Username updated')
      // await router.push(`/u/${username}`)
    } catch (e) {
      reset()
      toast.error(e.message)
    }
  }

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      void signIn('auth0') // send users to Auth0 login screen
    }
  })

  const shouldDisableSumit = !isValid || isSubmitting || !isDirty || userUuid == null || isSubmitSuccessful
  return (
    <div className='w-full lg:max-w-md'>

      <a className='link flex gap-2 items-center' href='/api/me'><ArrowLeftCircleIcon className='w-5 h-5' />Back to profile</a>
      <h1 className='mt-8 lg:mt-12'>Update Profile</h1>

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
            helper='This could be your first name or a nickname.'
          />

          <TextArea
            name='bio'
            label='Short bio'
            spellCheck
            placeholder='Something about you'
            helper='Let people know more about you.'
            // registerOptions={USERNAME_VALIDATION_RULES}
          />

          <Input
            name='website'
            label='Website'
            spellCheck={false}
            placeholder='https://example.com'
            helper='Your website.'
            // registerOptions={USERNAME_VALIDATION_RULES}
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

// const UserProfileSchema = Yup.object().shape({
//   name: Yup.string()
//     .max(50, 'Maximum 50 characters.'),
//   bio: Yup.string()
//     .notRequired()
//     .max(150, 'Maximum 150 characters')
//     .test('less-than-3-lines', 'Maximum 2 lines', (text) => (text?.split(/\r\n|\r|\n/)?.length ?? 0) <= 2),
//   website: Yup.string()
//     .nullable()
//     .notRequired()
//     .max(150, 'Maximum 150 characters')
//     .when('website', {
//       is: val => val?.length > 0,
//       then: rule => {
//         if (rule != null) {
//           return Yup.string().test('special-rules', 'Invalid URL', (x) => checkWebsiteUrl(x) !== null)
//         } else {
//           return Yup.string().notRequired()
//         }
//       }
//     })
// }, [['website', 'website']])

interface SimpleTooltipProps {
  message: string
}

const SimpleTooltip: React.FC<SimpleTooltipProps> = ({ message }) => (
  <Tooltip content={message}>
    <QuestionMarkCircleIcon className='text-info w-5 h-5' />
  </Tooltip>
)
