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
  QUERY_ORGANIZATIONS,
  AddOrganizationProps,
  UpdateOrganizationProps
} from '../../js/graphql/gql/organization'
import { toast } from 'react-toastify'
import { validate as uuidValidate } from 'uuid'

const DISPLAY_NAME_FORM_VALIDATION_RULES: RulesType = {
  required: 'A display name is required.',
  minLength: {
    value: 2,
    message: 'Minimum 2 characters.'
  }
}

const MUUID_VALIDATION = {
  validate: (value: string) => {
    return conjoinedStringToArray(value).every(uuidValidate) || 'Expected comma-separated MUUID hex strings eg. 49017dad-7baf-5fde-8078-f3a4b1230bbb, 88352d11-eb85-5fde-8078-889bb1230b11...'
  }
}

interface HtmlFormProps extends OrganizationEditableFieldsType {
  conjoinedAssociatedAreaIds: string // Form will return one large conjoined string
  conjoinedExcludedAreaIds: string // Form will return one large conjoined string
  orgId: string
  orgType: OrgType
}

interface OrganizationFormProps {
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
  const [addOrganization] = useMutation<{ addOrganization: OrganizationType }, { input: AddOrganizationProps }>(
    MUTATION_ADD_ORGANIZATION, {
      client: graphqlClient,
      onError: (error) => toast.error(`Unexpected error: ${error.message}`),
      refetchQueries: [{
        query: QUERY_ORGANIZATIONS,
        variables: {
          sort: { updatedAt: -1 },
          limit: 20
        }
      }]
    }
  )
  const [updateOrganization] = useMutation<{ updateOrganization: OrganizationType }, { input: UpdateOrganizationProps }>(
    MUTATION_UPDATE_ORGANIZATION, {
      client: graphqlClient,
      onError: (error) => toast.error(`Unexpected error: ${error.message}`),
      refetchQueries: [{
        query: QUERY_ORGANIZATIONS,
        variables: {
          sort: { updatedAt: -1 },
          limit: 20
        }
      }]
    }
  )
  // React-hook-form declaration
  const form = useForm<HtmlFormProps>({
    mode: 'onBlur',
    defaultValues: {
      displayName: existingOrg?.displayName ?? '',
      orgType: existingOrg?.orgType ?? OrgType.LOCAL_CLIMBING_ORGANIZATION,
      conjoinedAssociatedAreaIds: existingOrg?.associatedAreaIds?.join(', ') ?? '',
      conjoinedExcludedAreaIds: existingOrg?.excludedAreaIds?.join(', ') ?? '',
      description: existingOrg?.content?.description ?? '',
      website: existingOrg?.content?.website ?? '',
      email: existingOrg?.content?.email ?? '',
      instagramLink: existingOrg?.content?.instagramLink ?? '',
      donationLink: existingOrg?.content?.donationLink ?? '',
      facebookLink: existingOrg?.content?.facebookLink ?? ''
    }
  })

  const { handleSubmit, formState: { isSubmitting, dirtyFields } } = form

  /**
   * Routes to addOrganization or updateOrganization GraphQL calls
   * based on whether there was an existing org to update or not.
   * @param formProps Data populated by the user in the form
   * @returns
   */
  const submitHandler = async ({
    orgType,
    displayName,
    conjoinedAssociatedAreaIds,
    conjoinedExcludedAreaIds,
    website,
    email,
    donationLink,
    facebookLink,
    instagramLink,
    description
  }: HtmlFormProps): Promise<void> => {
    const dirtyEditableFields: OrganizationEditableFieldsType = {
      ...dirtyFields?.displayName === true && { displayName },
      ...dirtyFields?.conjoinedAssociatedAreaIds === true && { associatedAreaIds: conjoinedStringToArray(conjoinedAssociatedAreaIds) },
      ...dirtyFields?.conjoinedExcludedAreaIds === true && { excludedAreaIds: conjoinedStringToArray(conjoinedExcludedAreaIds) },
      ...dirtyFields?.website === true && { website },
      ...dirtyFields?.email === true && { email },
      ...dirtyFields?.donationLink === true && { donationLink },
      ...dirtyFields?.facebookLink === true && { facebookLink },
      ...dirtyFields?.instagramLink === true && { instagramLink },
      ...dirtyFields?.description === true && { description }
    }
    if (existingOrg == null) {
      const input: AddOrganizationProps = {
        orgType,
        ...dirtyEditableFields
      }
      await addOrganization({
        variables: { input },
        context: {
          headers: {
            authorization: `Bearer ${session?.data?.accessToken as string ?? ''}`
          }
        }
      })
    } else {
      const input: UpdateOrganizationProps = {
        orgId: existingOrg.orgId,
        ...dirtyEditableFields
      }
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
            {existingOrg == null &&
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
              label='Associated Area Ids:'
              name='conjoinedAssociatedAreaIds'
              placeholder='49017dad-7baf-5fde-8078-f3a4b1230bbb, 59e17fad-6bb8-de47-aa80-bba4b1a29be1'
              registerOptions={MUUID_VALIDATION}
            />
            <Input
              label='Excluded Area Ids:'
              labelAlt='Areas the organization explicitly chooses not to be associated with. Takes precedence over Associated Area Ids.'
              name='conjoinedExcludedAreaIds'
              placeholder='88352d11-eb85-5fde-8078-889bb1230b11'
              registerOptions={MUUID_VALIDATION}
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

/**
 * Convert comma-separated string to array.
 * Notably, '' and ',' return [].
 */
function conjoinedStringToArray (conjoined: string): string[] {
  return conjoined.split(',').map(s => s.trim()).filter(s => s !== '')
}
