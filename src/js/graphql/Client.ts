import {
  ApolloClient, HttpLink, InMemoryCache
} from '@apollo/client'

const uri: string = process.env.NEXT_PUBLIC_API_SERVER ?? ''

export const graphqlClient = new ApolloClient({
  uri,
  cache: new InMemoryCache(
    {
      typePolicies: {
        CragsNear: {
          keyFields: ['placeId', '_id']
        },
        Area: {
          keyFields: ['uuid']
        },
        AreaMetadata: {
          keyFields: ['areaId']
        },
        Climb: {
          keyFields: ['id']
        },
        ClimbTag: {
          keyFields: ['mediaUuid', 'climb', ['id']]
        },
        ClimbMetadata: {
          keyFields: ['climbId']
        }
      }
    }
  ),
  ssrMode: false // We relies on NextJS for SSR data management
})

const httpLink = new HttpLink({ uri: 'https://stg-api.openbeta.io' })

export const stagingGraphQLClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})
