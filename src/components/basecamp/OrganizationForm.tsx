import { Input, TextArea, Select } from '../ui/form'
import { useForm, FormProvider } from 'react-hook-form'
import { OrganizationType, OrgType, OrganizationEditableFieldsType, RulesType } from '../../js/types'
import clx from 'classnames'
import { graphqlClient } from '../../js/graphql/Client'
import { useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import {
  MUTATION_ADD_ORGANIZATION,
  MUTATION_UPDATE_ORGANIZATION,
  AddOrganizationProps,
  AddOrganizationReturnType,
  UpdateOrganizationProps,
  UpdateOrganizationReturnType
} from '../../js/graphql/gql/organization'
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

interface OrganizationFormProps = {
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
  const [updateOrganization] = useMutation<{ updateOrganization: UpdateOrganizationReturnType }, { input: UpdateOrganizationProps }>(
    MUTATION_UPDATE_ORGANIZATION, {
      client: graphqlClient,
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
   * @param formProps Data populated by the user in the form
   * @returns
   */
  const submitHandler = async (formProps: HtmlFormProps) => {
    if (existingOrg === null) {
      console.log('create', formProps)
      if (formProps.displayName == null) {
        console.error('`displayName` cannot be null when creating organization.')
        return
      }
      if (formProps.orgType == null) {
        console.error('`orgType` cannot be null when creating organization.')
        return
      }
      const input = removeNullUndefined({
        orgType: formProps.orgType,
        displayName: formProps.displayName,
        associatedAreaIds: formProps.associatedAreaIds,
        excludedAreaIds: formProps.excludedAreaIds,
        website: formProps.website,
        email: formProps.email,
        donationLink: formProps.donationLink,
        instagramLink: formProps.instagramLink,
        facebookLink: formProps.facebookLink,
        description: formProps.description
      }) as AddOrganizationProps
      await addOrganization({
        variables: { input },
        context: {
          headers: {
            authorization: `Bearer ${session?.data?.accessToken as string ?? ''}`
          }
        }
      })
    } else {
      console.log('update', formProps)
      const input = removeNullUndefined({
        orgId: existingOrg.orgId,
        displayName: formProps.displayName,
        associatedAreaIds: formProps.associatedAreaIds,
        excludedAreaIds: formProps.excludedAreaIds,
        website: formProps.website,
        email: formProps.email,
        donationLink: formProps.donationLink,
        instagramLink: formProps.instagramLink,
        // facebookLink: formProps.facebookLink,
        description: formProps.description
      }) as UpdateOrganizationProps
      await updateOrganization({
        variables: { input },
        context: {
          headers: {
            authorization: `Bearer ${session?.data?.accessToken as string ?? ''}`
          }
        }
      })
    }
    onClose()
  }

  return (
    <div className='px-8 pt-12 pb-4 flex flex-row flex-wrap'>
      <div className='basis-1/3 shink-0 grow min-w-[10em] pr-4'>
        <h2>Organization Editor</h2>
        {existingOrg !== null && ( // Id, OrgId, OrgTypes are immutable and only exist during updating.
          <div className='mt-4'>
            <div className='mt-4 break-words'>
              <h4>orgType</h4>
              <p className='text-xs'>{existingOrg.orgType}</p>
            </div>
            <div className='mt-4'>
              <h4>orgId</h4>
              <p className='text-xs'>{existingOrg.orgId}</p>
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
              />}
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
              label='Facebook:'
              name='facebookLink'
              placeholder='https://www.facebook.com/climbingorg'
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

function removeNullUndefined (obj: {[s: string]: any}): {[s: string]: NonNullable<any>} {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null)
  )
}
