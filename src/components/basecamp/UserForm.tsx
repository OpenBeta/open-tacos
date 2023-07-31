import type { User } from 'auth0'
import clx from 'classnames'
import { TextArea } from '../ui/form'
import { useForm, FormProvider } from 'react-hook-form'
import { MUUID_VALIDATION, conjoinedStringToArray } from './utils'
import axios from 'axios'
import useSWR from 'swr'
import { Role } from 'auth0'
import { UserRole } from '../../js/types'
import MultiSelect from '../ui/form/MultiSelect'
import { useEffect } from 'react'

interface UserFormProps {
  user: User
  onClose: () => void
}

interface HtmlFormProps {
  roles: string[]
  conjoinedOrgAdminOrgIds: string // Form will return one large conjoined string
}

const fetcher = async (url: string): Promise<any> => (await axios.get(url)).data

/*
 * Form for updating users.
*/
export default function UserForm ({ user, onClose }: UserFormProps): JSX.Element {
  const userId = user.user_id
  if (userId == null) {
    return <div>Can't load user. Missing user_id.</div>
  }
  const { data: roles, error, mutate } = useSWR<Role[]>(`/api/basecamp/userRoles?userId=${userId}`, fetcher)
  if (error != null) {
    return <div>{error}</div>
  }
  const defaultValues = {
    roles: roles?.map(r => r.name),
    conjoinedOrgAdminOrgIds: user.user_metadata?.orgAdminOrgIds?.join(', ') ?? ''
  }

  // React-hook-form declaration
  const form = useForm<HtmlFormProps>({
    mode: 'onBlur',
    defaultValues
  })
  const { handleSubmit, reset, watch, formState: { isSubmitting, dirtyFields } } = form

  useEffect(() => {
    /* Without this, even after useSWR's refetch produces new data, defaultValues.roles remains
     * undefined and falls back to the component's default (which for roles is []).
     */
    if (roles != null) {
      reset(
        defaultValues,
        { keepErrors: true, keepDirty: true }
      )
    }
  }, [roles, user.user_metadata?.orgAdminOrgIds]) // Dependencies of defaultValues

  /**
   * Call various Auth0 APIs to update new user data.
   * @param formProps Data populated by the user in the form
   * @returns
   */
  const submitHandler = async ({
    conjoinedOrgAdminOrgIds,
    roles
  }: HtmlFormProps): Promise<void> => {
    if ((dirtyFields?.roles as boolean | undefined) === true) {
      await axios.post(`/api/basecamp/userRoles?userId=${userId}${roles.map(r => `&roles=${r}`).join('')}`)
    }
    if (dirtyFields?.conjoinedOrgAdminOrgIds === true) {
      const orgAdminOrgIds = conjoinedStringToArray(conjoinedOrgAdminOrgIds)

      // Ideally we'd also validate that these orgIds match actual organizations.
      await axios.post(`/api/basecamp/user?userId=${userId}${orgAdminOrgIds.map(o => `&orgAdminOrgIds=${o}`).join('')}`)
    }
    void mutate() // Have SWR refetch data. Auth0 role endpoints don't return the latest state, so we can't set manually.
    onClose()
  }
  return (

    <div className='px-8 pt-12 pb-4 flex flex-row flex-wrap'>
      <div className='basis-1/3 shink-0 grow min-w-[10em] pr-4'>
        <h2>User Editor</h2>
        <div className='mt-4'>
          <div className='mt-4 break-words'>
            <h4>userId</h4>
            <p className='text-xs'>{userId}</p>
          </div>
          <div className='mt-4'>
            <h4>nick</h4>
            <p className='text-xs'>{user.user_metadata?.nick}</p>
          </div>
          <div className='mt-4'>
            <h4>email</h4>
            <p className='text-xs'>{user.email}</p>
          </div>
        </div>
      </div>
      <div className='basis-2/3 grow'>
        <FormProvider {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleSubmit(submitHandler)(e)
            }}
            className='min-w-[16em]'
          >
            <MultiSelect
              label='Roles:'
              name='roles'
              options={[UserRole.EDITOR, UserRole.ORG_ADMIN, UserRole.USER_ADMIN]}
              disabledOptions={[UserRole.USER_ADMIN] /* User will lose access to page if they toggle this off */}
              defaultOptions={[]}
            />
            <TextArea
              label='Organizations to administer:'
              labelAlt={!watch('roles')?.includes(UserRole.ORG_ADMIN) ? 'Requires org_admin role' : ''}
              name='conjoinedOrgAdminOrgIds'
              placeholder='49017dad-7baf-5fde-8078-f3a4b1230bbb, 59e17fad-6bb8-de47-aa80-bba4b1a29be1'
              disabled={!watch('roles')?.includes(UserRole.ORG_ADMIN)}
              registerOptions={MUUID_VALIDATION}
              className=''
            />
            <button
              className={
                clx('mt-4 btn btn-primary w-full',
                  isSubmitting ? 'loading btn-disabled' : ''
                )
              }
              type='submit'
            >Save
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
