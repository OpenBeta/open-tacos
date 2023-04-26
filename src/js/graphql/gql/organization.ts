import { gql } from '@apollo/client'
import { OrgType, OrganizationEditableFieldsType } from '../../types'

export const QUERY_ALL_ORGANIZATIONS = gql`
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
    createdAt
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
  updateOrganization(input: $input) {
    orgId
  }
}
`

export interface AddOrganizationProps extends OrganizationEditableFieldsType {
  orgType: OrgType
}

export interface UpdateOrganizationProps extends OrganizationEditableFieldsType {}

export interface AddOrganizationReturnType {
  orgId: string
}

export interface UpdateOrganizationReturnType {
  orgId: string
}
