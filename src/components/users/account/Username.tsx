import { useForm, FormProvider } from 'react-hook-form'
import { Input } from '../../ui/form'
import { RulesType } from '../../../js/types'
import { doesUsernameExist } from '../../../js/userApi/user'

const validUsername = /^[a-zA-Z0-9]+([_\\.-]?[a-zA-Z0-9])*$/i

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
      return validUsername.test(v) ? undefined : 'Can only have letters, numbers, with an optional separator: - .  _ (dash, period, underline)'
    },
    backendCheck: async (username: string) => await doesUsernameExist(username) ? 'Username already exists' : undefined
  }

}

export const Username: React.FC = () => {
  const form = useForm({
    mode: 'onChange'
    // defaultValues: { ...cache }
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
          affixClassname='font-light bg-base-100 pl-1 pr-1 text-sm lg:text-lg'
          className='pl-1 text-lg focus:ring-1 font-medium'
          spellCheck={false}
        //   labelAlt={
        //     <Tooltip
        //       content={<div>Examples:  <strong>Jane Doe 08/1993</strong> or <br /><strong>Yamada Hanako, Jean Dupont, 02/2023</strong><br />Leave blank if unknown.</div>}
        //     >
        //       <QuestionMarkCircleIcon className='text-info w-5 h-5' />
        //     </Tooltip>
        // }
          name='username'
          placeholder='coolbean2023'
          registerOptions={USERNAME_VALIDATION_RULES}
        />

        <button
          type='submit'
          disabled={!isValid || isSubmitting || isSubmitSuccessful}
          className='mt-16 btn btn-primary btn-solid btn-wide'
        >Save
        </button>
      </form>
    </FormProvider>
  )
}
