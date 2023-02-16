import { gql } from '@apollo/client'

import { AreaType, AreaUpdatableFieldsType, ClimbDisciplineRecord } from '../../types'

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

export interface DeleteOneAreaInputType {
  uuid: string
}

export type DeleteOneAreaReturnType = Pick<AreaType, 'uuid' | 'areaName'>

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
export const MUTATION_DELETE_CLIMBS = gql`
mutation ($input: DeleteManyClimbsInput) {
  deleteClimbs(input: $input)
}
`

export interface IndividualClimbChangeInput {
  id?: string // Null or undefined id will create a new climb
  name?: string
  description?: string
  location?: string
  protection?: string
  grade?: string
  leftRightIndex?: number
  disciplines?: Partial<ClimbDisciplineRecord>
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
  parentUuid?: string
  countryCode?: string
}

export type AddAreaReturnType = Pick<AreaType, 'areaName'|'uuid'>

export interface RemoveAreaProps {
  uuid: string
}

export type RemoveAreaReturnType = Pick<AreaType, 'areaName'|'uuid'>

export interface UpdateAreaProps extends AreaUpdatableFieldsType {
  uuid: string
}

export type UpdateOneAreaInputType = Partial<Required<Pick<AreaUpdatableFieldsType, 'areaName' | 'description' | 'lat' | 'lng' |'isLeaf' | 'isBoulder'>> & { uuid: string }>

export type UpdateAreaApiReturnType = Pick<AreaType, 'areaName'|'uuid'>

export interface DeleteManyClimbsInputType {
  parentId: string
  idList: string[]
}

export type DeleteManyClimbsAPI = (input: DeleteManyClimbsInputType) => Promise<number>
