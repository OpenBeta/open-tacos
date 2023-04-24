import { Input, TextArea, Select } from '../ui/form'
import { useForm, FormProvider } from 'react-hook-form'
import { OrganizationType, OrgType, OrganizationEditableFieldsType, RulesType } from '../../js/types'
import clx from 'classnames'
import { graphqlClient } from '../../js/graphql/Client'
import { useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { MUTATION_ADD_ORGANIZATION, AddOrganizationProps, AddOrganizationReturnType } from '../../js/graphql/gql/organization'
import { toast } from 'react-toastify'


const DISPLAY_NAME_FORM_VALIDATION_RULES: RulesType = {
  required: 'A display name is required.',
  minLength: {
    value: 2,
    message: 'Minimum 2 characters.'
  },
}

interface HtmlFormProps extends OrganizationEditableFieldsType {
  orgId: string
  orgType: OrgType
}

type OrganizationFormProps = {
  existingOrg: OrganizationType | null
  onClose: () => void
}

/*
 * Form for creating and updating organzations.
 * When existingOrg is null, form creates new org.
 * When not null, form updates the existingOrg instead.
*/
export default function OrganizationForm ({ existingOrg, onClose }: OrganizationFormProps): JSX.Element {
  const session = useSession()
  const [addOrganization] = useMutation<{ addOrganization: AddOrganizationReturnType }, { input: AddOrganizationProps }>(
    MUTATION_ADD_ORGANIZATION, {
      client: graphqlClient,
      /*onCompleted: (data) => {
        wizardActions.addAreaStore.recordStepFinal()
        void fetch(`/api/revalidate?a=${data.addArea.uuid}`)
        void fetch('/api/revalidate?page=/edit')
      },*/
      onError: (error) => toast.error(`Unexpected error: ${error.message}`)
  
    }
  )
  // React-hook-form declaration
  const form = useForm<HtmlFormProps>({
    mode: 'onBlur',
    defaultValues: existingOrg || {}
  })

  const { handleSubmit, formState: { isSubmitting, dirtyFields }, reset, getValues } = form

  /**
   * Routes to addOrganization or updateOrganization GraphQL calls
   * based on whether there was an existing org to update or not.
   * @param input Data populated by the user in the form
   * @returns 
   */
  const submitHandler = async (input: HtmlFormProps) => {
    if (existingOrg === null) {
      console.log('create', input)
      const { displayName, orgType } = input
      if (displayName === undefined) {
        console.error('DisplayName cannot be null when creating organization.')
        return
      }
      await addOrganization({
        variables: { 
          input: { displayName, orgType }
        },
        context: {
          headers: {
            authorization: `Bearer ${session?.data?.accessToken as string ?? ''}`
          }
        }
      })
      onClose()
    } else {
      console.log('update', input)
    }
  }

  return (
    <div className='px-8 pt-12 pb-4 flex flex-row flex-wrap'>
      <div className='basis-1/3 shink-0 grow min-w-[10em] pr-2'>
        <h2>Organization Editor</h2>
        {existingOrg !== null && ( // Id, OrgId, OrgTypes are immutable and only exist during updating.
          <div className='mt-4'>
            <div>
              <h3>id</h3>
              {existingOrg.id}
            </div>
            <div>
              <h3>orgType</h3>
              {existingOrg.orgType}
            </div>
            <div>
              <h3>orgId</h3>
              {existingOrg.orgId}
            </div>
          </div>
        )}
      </div>
      <div className='basis-2/3 grow'>
        <FormProvider {...form}>
        <form onSubmit={handleSubmit(submitHandler)} className='min-w-[16em]'>
          <Input
            label='Display Name:'
            name='displayName'
            placeholder='Climbing Org'
            registerOptions={DISPLAY_NAME_FORM_VALIDATION_RULES}
          />
          {existingOrg === null && 
            <Select 
              label='Organization Type:'
              name='orgType'
              options={['LOCAL_CLIMBING_ORGANIZATION']}
              defaultOption='LOCAL_CLIMBING_ORGANIZATION'
            />
          }
          <TextArea
            label='Description:'
            name='description'
            placeholder='Seattle-based group founded in 1979 to steward climbing areas across the Pacific Northwest.'
            rows={2}
          />
          <Input 
            label='Email:'
            name='email'
            placeholder='admin@climbingorg.com'
          />
          <Input 
            label='Website:'
            name='website'
            placeholder='https://www.climbingorg.com'
          />
          <Input
           label='Instagram:'
           name='instagramLink'
           placeholder='https://www.instagram.com/climbingorg'
          />
          <Input
           label='Donation Link:'
           name='donationLink'
           placeholder='https://www.climbingorg.com/donate'
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