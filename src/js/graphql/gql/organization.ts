import { gql } from '@apollo/client'
import { OrgType, OrganizationEditableFieldsType } from '../../types'

const ORGANIZATION_FRAGMENT = gql`
fragment OrganizationFragment on Organization {
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
    createdAt
    updatedAt
}
`

export const QUERY_ORGANIZATIONS = gql`
${ORGANIZATION_FRAGMENT}
query ($filter: OrgFilter, $sort: OrgSort) {
  organizations(filter: $filter, sort: $sort) {
    ...OrganizationFragment
  }
}
`

export const MUTATION_ADD_ORGANIZATION = gql`
${ORGANIZATION_FRAGMENT}
mutation ($input: AddOrganizationInput!) {
  addOrganization(input: $input) {
    ...OrganizationFragment
  }
}
`

export const MUTATION_UPDATE_ORGANIZATION = gql`
${ORGANIZATION_FRAGMENT}
mutation ($input: OrganizationEditableFieldsInput!) {
  updateOrganization(input: $input) {
    ...OrganizationFragment
  }
}
`

export interface AddOrganizationProps extends OrganizationEditableFieldsType {
  orgType: OrgType
}

export interface UpdateOrganizationProps extends OrganizationEditableFieldsType {}
