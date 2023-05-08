import { gql } from '@apollo/client'
import AwesomeDebouncePromise from 'awesome-debounce-promise'

import { AreaType, ClimbType, TickType, MediaByUsers, CountrySummaryType, MediaWithTags } from '../types'
import { graphqlClient } from './Client'
import { CORE_CRAG_FIELDS, QUERY_CRAGS_WITHIN, QUERY_TICKS_BY_USER_AND_CLIMB, QUERY_TICKS_BY_USER, QUERY_ALL_COUNTRIES } from './gql/fragments'
import { QUERY_MEDIA_FOR_FEED } from './gql/tags'
import { QUERY_USER_MEDIA } from './gql/users'
import { QUERY_CLIMB_BY_ID } from './gql/climbById'

interface CragsDetailsNearType {
  data: AreaType[] // Should use Omit or Pick
  placeId: string | undefined
  error?: string | undefined
}

export const getCragDetailsNear = async (
  placeId: string = 'unspecified',
  lnglat: number[],
  range: number[],
  includeCrags: boolean = false
): Promise<CragsDetailsNearType> => {
  try {
    const rs = await graphqlClient.query({
      query: CRAGS_NEAR,
      fetchPolicy: 'cache-first',
      variables: {
        lng: lnglat[0],
        lat: lnglat[1],
        placeId,
        minDistance: range[0],
        maxDistance: range[1],
        includeCrags
      }
    })

    const { cragsNear } = rs.data
    const groups = cragsNear.map(entry => entry.crags).flat()
    return { data: groups, placeId }
  } catch (e) {
    console.log(e)
  }
  return {
    data: [],
    error: 'API error',
    placeId: undefined
  }
}

const CRAGS_NEAR = gql`
  ${CORE_CRAG_FIELDS}
  query CragsNear($placeId: String, $lng: Float, $lat: Float, $minDistance: Int, $maxDistance: Int, $includeCrags: Boolean) {
  cragsNear(placeId: $placeId, lnglat: {lat: $lat, lng: $lng}, minDistance: $minDistance, maxDistance: $maxDistance, includeCrags: $includeCrags) {
      count
      _id 
      placeId
      crags {
        ...CoreCragFields
      }
  }
}`

/**
 * Fetch an area by uuid from the cache
 * @param uuid
 * @returns Area or null if not found
 */
export const getAreaByUUID = (uuid: string): AreaType | null => {
  try {
    const queryId = `Area:{"uuid":"${uuid}"}` // Very strange looking id, but this is how Apollo works
    const query = graphqlClient.readFragment({
      id: queryId,
      fragment: CORE_CRAG_FIELDS
    }
    )
    if (query !== null) {
      return query
    }
  } catch (e) {
    console.log(e)
    return null
  }
  return null
}

export const getMediaForFeed = async (maxUsers: number, maxFiles: number): Promise<MediaByUsers[]> => {
  try {
    const rs = await graphqlClient.query<{getMediaForFeed: MediaByUsers[]}>({
      query: QUERY_MEDIA_FOR_FEED,
      variables: {
        maxUsers,
        maxFiles
      },
      notifyOnNetworkStatusChange: true
    })

    if (Array.isArray(rs.data?.getMediaForFeed)) {
      return rs.data?.getMediaForFeed
    }
    console.log('WARNING: getMediaForFeed() returns non-array data')
    return []
  } catch (e) {
    console.log('####### getMediaForFeed() error', e)
  }
  return []
}

export const getCragsWithin = async ({ bbox, zoom }): Promise<any> => {
  try {
    const rs = await graphqlClient.query<{cragsWithin: AreaType[]}>({
      query: QUERY_CRAGS_WITHIN,
      variables: {
        filter: {
          bbox,
          zoom
        }
      },
      notifyOnNetworkStatusChange: true
    })

    if (Array.isArray(rs.data?.cragsWithin)) {
      return rs.data?.cragsWithin ?? []
    }
    console.log('WARNING: cragsWithin() returns non-array data')
    return []
  } catch (e) {
    console.log('cragsWithin() error', e)
  }
  return []
}

export const getCragsWithinNicely = AwesomeDebouncePromise(getCragsWithin, 1000)

export const getTicksByUserAndClimb = async (climbId: string, userId: string): Promise<any> => {
  try {
    const res = await graphqlClient.query<{ userTicksByClimbId: TickType[] }>({
      query: QUERY_TICKS_BY_USER_AND_CLIMB,
      variables: {
        climbId,
        userId
      },
      fetchPolicy: 'no-cache'
    })

    if (Array.isArray(res.data?.userTicksByClimbId)) {
      return res.data.userTicksByClimbId
    }
  } catch (e) {
    console.error('Error fetching ticks by user and climb id', e)
  }
  return []
}

export const getTicksByUser = async (userId: string): Promise<TickType[]> => {
  try {
    const res = await graphqlClient.query<{ userTicks: TickType[] }>({
      query: QUERY_TICKS_BY_USER,
      variables: {
        userId
      },
      fetchPolicy: 'no-cache'
    })

    if (Array.isArray(res.data?.userTicks)) {
      return res.data.userTicks
    }
  } catch (e) {
    console.error('Error fetching ticks by user and climb id', e)
  }
  return []
}

export const getAllCountries = async (): Promise<CountrySummaryType[]> => {
  try {
    const res = await graphqlClient.query<{ countries: CountrySummaryType[] }>({
      query: QUERY_ALL_COUNTRIES
    })

    if (Array.isArray(res.data?.countries)) {
      return res.data.countries
    }
  } catch (e) {
    console.error('Error fetching all countries', e)
  }
  return []
}

export const getUserMedia = async (userUuid: string, maxFiles = 1000): Promise<MediaWithTags[]> => {
  const res = await graphqlClient.query<{ getUserMedia: MediaWithTags[] }, { userUuid: string, maxFiles: number }>({
    query: QUERY_USER_MEDIA,
    variables: {
      userUuid,
      maxFiles
    },
    fetchPolicy: 'no-cache'
  })
  return res.data.getUserMedia
}

/**
 * Get climb by id
 * @param id climb id as string in uuid v4 format
 */
export const getClimbById = async (id: string): Promise<ClimbType> => {
  const res = await graphqlClient.query<{ climb: ClimbType }, { id: string }>({
    query: QUERY_CLIMB_BY_ID,
    variables: {
      id
    },
    fetchPolicy: 'no-cache'
  })
  return res.data.climb
}
