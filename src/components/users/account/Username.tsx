import { useForm, FormProvider } from 'react-hook-form'
import { Input } from '../../ui/form'
import { RulesType } from '../../../js/types'
import { doesUsernameExist } from '../../../js/userApi/user'
import Tooltip from '../../ui/Tooltip'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

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
    },
    backendCheck: async (username: string) => await doesUsernameExist(username) ? 'Username already exists' : undefined
  }

}

export const Username: React.FC = () => {
  const form = useForm({
    mode: 'onChange',
    defaultValues: { username: '' }
  })

  const { handleSubmit, formState: { isValid, isSubmitting, isSubmitSuccessful } } = form

  const submitHandler = async (): Promise<void> => {
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(submitHandler)} className='mt-6 first:mt-0'>
        <Input
          label='Username'
          unitLabel='https://openbeta.io/u/'
          unitLabelPlacement='left'
          affixClassname='font-light bg-base-100 pl-1 pr-1 text-xs lg:text-lg'
          className='pl-1 text-lg focus:ring-1 border-base-200 font-medium'
          spellCheck={false}
          labelAlt={
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
        }
          name='username'
          placeholder='coolbean2023'
          registerOptions={USERNAME_VALIDATION_RULES}
        />

        <button
          type='submit'
          disabled={!isValid || isSubmitting || isSubmitSuccessful}
          className='mt-10 btn btn-primary btn-solid btn-block md:btn-wide'
        >Save
        </button>
      </form>
    </FormProvider>
  )
}
