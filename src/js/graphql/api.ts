import { gql } from '@apollo/client'
import AwesomeDebouncePromise from 'awesome-debounce-promise'

import { AreaType, TickType, MediaTagWithClimb, MediaByAuthor, CountrySummaryType } from '../types'
import { graphqlClient, stagingGraphQLClient } from './Client'
import { CORE_CRAG_FIELDS, QUERY_TAGS_BY_MEDIA_ID, QUERY_RECENT_MEDIA, QUERY_CRAGS_WITHIN, QUERY_TICKS_BY_USER_AND_CLIMB, QUERY_TICKS_BY_USER, QUERY_ALL_COUNTRIES } from './gql/fragments'
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

export const getTagsByMediaId = async (uuidList: string[]): Promise<MediaTagWithClimb[]> => {
  try {
    const rs = await graphqlClient.query({
      query: QUERY_TAGS_BY_MEDIA_ID,
      variables: {
        uuidList
      },
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true
    })

    if (Array.isArray(rs.data?.getTagsByMediaIdList)) {
      return rs.data?.getTagsByMediaIdList
    }
  } catch (e) {
    console.log('getTagsByMediaId() error', e)
  }
  return []
}

export const getRecentMedia = async (userLimit = 10): Promise<MediaByAuthor[]> => {
  try {
    const rs = await graphqlClient.query<{getRecentTags: MediaByAuthor[]}>({
      query: QUERY_RECENT_MEDIA,
      variables: {
        userLimit
      },
      notifyOnNetworkStatusChange: true
    })

    if (Array.isArray(rs.data?.getRecentTags)) {
      return rs.data?.getRecentTags
    }
    console.log('WARNING: getRecentMedia() returns non-array data')
    return []
  } catch (e) {
    console.log('getRecentMedia() error', e)
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
    const res = await stagingGraphQLClient.query<{ userTicksByClimbId: TickType[] }>({
      query: QUERY_TICKS_BY_USER_AND_CLIMB,
      variables: {
        climbId,
        userId
      }
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
    const res = await stagingGraphQLClient.query<{ userTicks: TickType[] }>({
      query: QUERY_TICKS_BY_USER,
      variables: {
        userId
      }
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
