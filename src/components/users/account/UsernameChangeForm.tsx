import { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'
import { formatDistanceToNowStrict } from 'date-fns'

import { Input } from '../../ui/form'
import { RulesType, Username } from '../../../js/types'
import useUserProfileCmd from '../../../js/hooks/useUserProfileCmd'
import Tooltip from '../../ui/Tooltip'
import Link from 'next/link'

const specialWords = /openbeta|0penbeta|admin|adm1n|null|undefined/i
const validUsername = /^[a-zA-Z0-9]+([_\\.-]?[a-zA-Z0-9])*$/i
const whitespace = /[\s]+/g
const endsWithSeparators = /[_\\.-]+$/i
const beginsWithSeparators = /^[_\\.-]+/i
const muiltipleSeparators = /[_\\.-]{2,}/i

export const USERNAME_VALIDATION_RULES: RulesType = {
  required: 'Cannot be blank',
  minLength: {
    value: 2,
    message: 'Minimum 2 letters'
  },
  maxLength: {
    value: 30,
    message: 'Maxium 30 letters'
  },
  validate: {
    formatCheck: (v: string): string | undefined => {
      if (v.length === 0) return undefined
      if (whitespace.test(v)) {
        return 'Use only letters and numbers'
      }
      if (endsWithSeparators.test(v)) {
        return 'Must end with a letter or number'
      }
      if (beginsWithSeparators.test(v)) {
        return 'Must start with a letter or number'
      }
      if (muiltipleSeparators.test(v)) {
        return 'Use only 1 consecutive separator'
      }
      if (specialWords.test(v)) {
        return 'Reserved keywords detected.  Please pick a different username.'
      }
      return validUsername.test(v) ? undefined : 'Invalid format'
    }
  }

}

interface FormProps {
  username: string
}

/**
 * A form for creating username (new user) or updating existing username.
 */
export const UsernameChangeForm: React.FC = () => {
  const session = useSession()
  const router = useRouter()

  const { getUsernameById, updateUsername, doesUsernameExist } = useUserProfileCmd({ accessToken: session?.data?.accessToken as string })

  const [isNewUser, setNewUser] = useState(false)
  const [initials, setInitials] = useState<any>()

  const form = useForm<FormProps>({
    mode: 'onChange',
    defaultValues: { username: initials?.username },
    delayError: 500
  })

  const { handleSubmit, reset, watch, setError, clearErrors, formState: { isValid, isDirty, isValidating, isSubmitting } } = form

  const submitHandler = async ({ username }: FormProps): Promise<void> => {
    if (initials?.userUuid == null) {
      return
    }

    try {
      await updateUsername({ userUuid: initials.userUuid, username })
      void router.push('/')
      toast.info('Username updated')
    } catch (e) {
      reset()
      toast.error(e.message)
    }
  }

  const username = watch('username')

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      void signIn('auth0') // send users to Auth0 login screen
    }
  })

  useEffect(() => {
    if (isValidating && isDirty) {
      void doesUsernameExist(username).then(value => {
        if (value === 'error') {
          setError('username', { type: 'custom', message: 'Unexpected error.  Please notify support@openbeta.io' })
          return
        }
        if (value) {
          setError('username', { type: 'custom', message: 'Username already exists' })
        } else {
          clearErrors('username')
        }
      })
    }
  }, [isValidating, isDirty])

  useEffect(() => {
    const uuid = session.data?.user.metadata.uuid ?? null
    if (uuid != null) {
      void getUsernameById({ userUuid: uuid }).then(value => {
        if (value == null) {
          setNewUser(true)
        } else {
          setInitials({
            userUuid: uuid,
            username: value.username,
            lastUpdated: value.lastUpdated
          })
          reset({ username: value.username })
        }
      })
    }
  }, [session.data?.user])

  return (
    <div className='w-full lg:max-w-md'>
      {isNewUser
        ? (<h1>Create a username</h1>)
        : (
          <>
            <Link href='/'><a className='underline'>Home</a></Link>
            <h1 className='mt-8 lg:mt-32'>Change username</h1>
          </>)}
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(submitHandler)} className='mt-10 flex flex-col gap-y-6'>
          {initials != null && <CurrentUsername {...initials} />}
          <Input
            name='username'
            label='New username'
            unitLabel='https://openbeta.io/u/'
            unitLabelPlacement='left'
            affixClassname='font-light bg-base-100 pl-1 pr-1 hidden md:inline-flex lg:text-lg'
            className='pl-1 text-lg focus:ring-1 border-base-200 font-medium'
            spellCheck={false}
            labelAlt={<TooltipComponent />}
            placeholder='coolbean2023'
            registerOptions={USERNAME_VALIDATION_RULES}
          />

          <button
            type='submit'
            disabled={!isValid || isSubmitting || !isDirty}
            className='mt-10 btn btn-primary btn-solid btn-block md:btn-wide'
          >Save
          </button>
        </form>
      </FormProvider>
    </div>
  )
}

const TooltipComponent: React.FC = () => (
  <Tooltip
    content={
      <div className='p-2'>
        <div className='font-semibold'>Username tips:</div>
        <ul className='list-disc px-2 space-y-1'>
          <li>You can use letters and numbers</li>
          <li>Add optional separators: period, dash and underline to improve readability.  Ex: <em>crimps_for_life</em> <em>mary.jane</em></li>
          <li>You may change your username once every 14 days</li>
        </ul>
      </div>
    }
  >
    <QuestionMarkCircleIcon className='text-info w-5 h-5' />
  </Tooltip>
)

const CurrentUsername: React.FC<Username> = ({ lastUpdated, username }) => (
  <div className='form-control'>
    <div className='label'>
      <span className='label-text font-semibold'>Current username</span>
      {lastUpdated != null && <span className='label-text text-base-300/60 italic'>Updated {formatDistanceToNowStrict(lastUpdated, { addSuffix: true })}</span>}
    </div>
    <div className='pl-1 font-light'>{username}</div>
  </div>)
