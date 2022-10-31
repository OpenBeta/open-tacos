import { gql } from '@apollo/client'

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

/**
 * Create a media <--> climb (or area) association
 */
export const MUTATION_ADD_CLIMB_TAG_TO_MEDIA = gql`
  mutation tagPhotoWithClimb($mediaUuid: ID!, $mediaUrl: String!, $srcUuid: ID!) {
    setTag(
      input: {
        mediaUuid: $mediaUuid,
        mediaUrl: $mediaUrl,
        mediaType: 0,
        destinationId: $srcUuid,
        destType: 0
      }
    ) {
        ... on ClimbTag {
          mediaUuid
          mediaUrl
          climb {
            id
            name
          }
        }
      }
  }`

export const MUTATION_REMOVE_MEDIA_TAG = gql`
  mutation removeTag($mediaUuid: ID!, $destinationId: ID!) {
    removeTag(mediaUuid: $mediaUuid, destinationId: $destinationId) {
      mediaUuid
      destinationId
      removed
    }
  }`

export const QUERY_TAGS_BY_MEDIA_ID = gql`
  query getTagsByMediaIdList($uuidList: [ID!]) {
    getTagsByMediaIdList(uuidList: $uuidList) {
      ... on ClimbTag {
        mediaUuid
        mediaUrl
        climb {
          id
          name
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
