import { gql } from '@apollo/client'
import { OrgType } from '../../types'

export const QUERY_All_ORGANIZATIONS = gql`
query ($filter: OrgFilter, $sort: OrgSort) {
  organizations(filter: $filter, sort: $sort) {
    orgId
    orgType
    associatedAreaIds
    excludedAreaIds
    displayName
    content {
      website
      email
      donationLink
      instagramLink
      description
    }
  }
}
`

export const MUTATION_ADD_ORGANIZATION = gql`
mutation ($input: AddOrganizationInput!) {
  addOrganization(input: $input) {
    orgId
  }
}
`

export const MUTATION_UPDATE_ORGANIZATION = gql`
mutation ($input: OrganizationEditableFieldsInput!) {
  updateOrganization(input: $input)
}
`

export interface AddOrganizationProps {
  orgType: OrgType
  displayName: string
}

export interface AddOrganizationReturnType {
  orgId: string
}