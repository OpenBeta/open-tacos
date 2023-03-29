import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client'
import { onError } from '@apollo/client/link/error'

const uri: string = process.env.NEXT_PUBLIC_API_SERVER ?? ''
const httpLinkPro = new HttpLink({
  uri: uri
})
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors !== null && graphQLErrors !== undefined) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error('GraphQL error', {
        message: message,
        locations: locations,
        path: path
      })
    })
  }

  if (networkError !== null && networkError !== undefined) {
    console.error('Network error', {
      name: networkError.name,
      statusCode: networkError.statusCode,
      erros: JSON.stringify(networkError.result),
      extentions: JSON.stringify(networkError.extensions)
    })
  }
})

export const graphqlClient = new ApolloClient({
  link: from([errorLink, httpLinkPro]),
  cache: new InMemoryCache({
    addTypename: true,
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
      },
      History: {
        keyFields: ['id']
      }
    }
  }),
  ssrMode: false // We relies on NextJS for SSR data management
})

const httpLink = new HttpLink({ uri: 'https://stg-api.openbeta.io' })

export const stagingGraphQLClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache()
})

let openCollectiveUri: string = process.env.OPEN_COLLECTIVE_API_URI ?? ''
const openCollectiveApiKey: string = process.env.OPEN_COLLECTIVE_API_KEY ?? ''
if (openCollectiveApiKey !== '') {
  openCollectiveUri = `${openCollectiveUri}/${openCollectiveApiKey}`
}

export const openCollectiveClient = new ApolloClient({
  uri: openCollectiveUri,
  cache: new InMemoryCache()
})
