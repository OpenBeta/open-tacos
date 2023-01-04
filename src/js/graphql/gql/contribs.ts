import { gql } from '@apollo/client'

import { AreaType, AreaUpdatableFieldsType } from '../../types'

/**
 * Queries and Mutations for edits
 */

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

export const MUTATION_REMOVE_AREA = gql`
mutation ($uuid: String!) {
    removeArea(input: { uuid: $uuid } ) {
      areaName
      uuid
    }
}`

export const MUTATION_UPDATE_AREA = gql`
mutation ($uuid: String!, $areaName: String, $isDestination: Boolean, $isLeaf: Boolean, $isBoulder: Boolean, $shortCode: String, $lat: Float, $lng: Float, $description: String) {
    updateArea(input: { 
      uuid: $uuid,
      areaName: $areaName,
      isDestination: $isDestination,
      isLeaf: $isLeaf,
      isBoulder: $isBoulder,
      shortCode: $shortCode,
      lat: $lat,
      lng: $lng,
      description: $description
    }) {
      areaName
      uuid
    }
}`

export const MUTATION_UPDATE_CLIMBS = gql`
mutation ($input: UpdateClimbsInput) {
  updateClimbs(input: $input)
}
`

export interface IndividualClimbChangeInput {
  id: string
  name?: string
  description?: string
  location?: string
  protection?: string
  leftRightIndex?: number
}

export interface UpdateClimbsInput {
  parentId: string
  changes: IndividualClimbChangeInput[]
}

/**
 * A reusable fragment
 */
export const FRAGMENT_CHANGE_HISTORY = gql`
  fragment ChangeHistoryFields on History {
    id
    createdAt
    operation
    editedBy
    changes {
      dbOp
      changeId
      updateDescription {
        updatedFields
      }
      fullDocument {
        ... on Area {
          areaName
          uuid
          metadata {
            leaf
            areaId
          }
        }
        ... on Climb {
          id
          name
          uuid
        }
      }
    }
  }`

export const QUERY_RECENT_CHANGE_HISTORY = gql`
  ${FRAGMENT_CHANGE_HISTORY}
  query ($filter: AllHistoryFilter) {
    getChangeHistory(filter: $filter) {
      ...ChangeHistoryFields
    }
  }
`

export interface AddAreaProps {
  name: string
  parentUuid: string | null
  countryCode: string | null
}

export type AddAreaReturnType = Pick<AreaType, 'areaName'|'uuid'>

export interface RemoveAreaProps {
  uuid: string
}

export type RemoveAreaReturnType = Pick<AreaType, 'areaName'|'uuid'>

export interface UpdateAreaProps extends AreaUpdatableFieldsType {
  uuid: string
}

export type UpdateAreaReturnType = Pick<AreaType, 'areaName'|'uuid'>
