import { gql } from '@apollo/client'

import { AreaType } from '../types'

export const MUTATION_ADD_COUNTRY = gql`
mutation ($isoCode: String!) {
    addCountry(input: {alpha3ISOCode: $isoCode}) {
      areaName
      uuid
    }
}`

export const MUTATION_ADD_AREA = gql`
mutation ($name: String!, $parentUuid: ID, $countryCode: String) {
    addArea(input: { name: $name, parentUuid: $parentUuid, countryCode: $countryCode } ) {
      areaName
      uuid
    }
}`

export const RECENT_CHANGE_HISTORY = gql`
query ($filter: AllHistoryFilter) {
  getChangeHistory(filter: $filter) {
    id
    createdAt
    operation
    editedBy
    changes {
      dbOp
      changeId
    }
  }
}
`

export interface AddAreaProps {
  name: string
  parentUuid: string | null
  countryCode: string | null
}

export type AddAreaReturnType = Pick<AreaType, 'areaName'|'uuid'>
