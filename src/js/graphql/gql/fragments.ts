import { gql } from '@apollo/client'
import { TagTargetType } from '../../types'

/**
 * A place for all reusable GQL queries and mutation.
 * Todo: separate them by feature/function
 */

export const CORE_CRAG_FIELDS = gql`
  fragment CoreCragFields on Area {
    areaName
    id
    uuid
    totalClimbs
    pathTokens
    metadata {
      lat
      lng
      areaId
    }
    aggregate {
      byDiscipline {
        sport {
          total
          bands {
            advanced
            beginner
            expert
            intermediate
          }
        }
        trad {
          total
          bands {
            advanced
            beginner
            expert
            intermediate
          }
        }
        boulder {
          total
          bands {
            advanced
            beginner
            expert
            intermediate
          }
        }
        tr {
          total
          bands {
            advanced
            beginner
            expert
            intermediate
          }
        }
      }
      byGradeBand {
        advanced
        beginner
        expert
        intermediate
      }
    }
  }
`

export interface SetTagType {
  mediaUuid: string
  mediaUrl: string
  destinationId: string
  destType: TagTargetType
}
/**
 * Create a media <--> climb (or area) association
 */
export const MUTATION_ADD_CLIMB_TAG_TO_MEDIA = gql`
  mutation tagPhotoWithClimb($mediaUuid: ID!, $mediaUrl: String!, $destinationId: ID!, $destType: Int!) {
    setTag(
      input: {
        mediaUuid: $mediaUuid,
        mediaUrl: $mediaUrl,
        mediaType: 0,
        destinationId: $destinationId,
        destType: $destType
      }
    ) {
        ... on ClimbTag {
          id
          mediaUuid
          mediaUrl
          destType
          climb {
            id
            name
          }
        }
        ... on AreaTag {
          id
          mediaUuid
          mediaUrl
          destType
          area {
            uuid
            areaName
          }
        }
      }
  }`

export const MUTATION_REMOVE_MEDIA_TAG = gql`
  mutation removeTag($tagId: ID!) {
    removeTag(tagId: $tagId) {
      id
      removed
    }
  }`

export const QUERY_TAGS_BY_MEDIA_ID = gql`
  query getTagsByMediaIdList($uuidList: [ID!]) {
    getTagsByMediaIdList(uuidList: $uuidList) {
      ... on ClimbTag {
        id
        mediaUuid
        mediaUrl
        destType
        climb {
          id
          name
        }
      }
      ... on AreaTag {
        id
        mediaUuid
        mediaUrl
        destType
        area {
          uuid
          areaName
        }
      }
    }
  }
`

export const QUERY_RECENT_MEDIA = gql`
  query ($userLimit: Int) {
    getRecentTags(userLimit: $userLimit) {
      authorUuid
      tagList {
        destType
        mediaUrl
        mediaType
        destination
      }
    }
  }
`

export const QUERY_CRAGS_WITHIN = gql`
  query ($filter: SearchWithinFilter) {
    cragsWithin(filter: $filter) {
      areaName
      uuid
      totalClimbs
      density
      metadata {
        lat
        lng
        areaId
        leaf
      }
    }
  }
`

export const MUTATION_IMPORT_TICKS = gql`
mutation ImportTicks($input: [Tick]) {
  importTicks(input: $input) {
    _id
    userId
    name
    notes
    climbId
    style
    attemptType
    dateClimbed
    grade
  }
}`

export const MUTATION_ADD_TICK = gql`
mutation AddTick($input: Tick) {
  addTick(input: $input) {
    _id
    userId
    name
    notes
    climbId
    style
    attemptType
    dateClimbed
    grade
  }
}`

export const QUERY_TICKS_BY_USER_AND_CLIMB = gql`
query userTicksByClimbId($userId: String, $climbId: String) {
  userTicksByClimbId(userId: $userId, climbId: $climbId) {
    _id
    name
    notes
    climbId
    style
    attemptType
    dateClimbed
    grade
    userId
  }
}
`

export const QUERY_TICKS_BY_USER = gql`
query userTicks($userId: String) {
  userTicks(userId: $userId) {
    _id
    name
    notes
    climbId
    style
    attemptType
    dateClimbed
    grade
    userId
  }
}
`

export const MUTATION_REMOVE_TICK_BY_ID = gql`
mutation deleteTick($_id: ID!) {
  deleteTick(_id: $_id) {
    _id
    removed
  }
}
`

export const QUERY_ALL_COUNTRIES = gql`
  query countries {
    countries {
      areaName
      uuid
      totalClimbs
      updatedAt
      metadata {
        lat
        lng
        areaId
      }
    }
  }
`
