import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client'
import { onError } from '@apollo/client/link/error'

const uri: string = process.env.NEXT_PUBLIC_API_SERVER ?? ''
const httpLinkPro = new HttpLink({
  uri
})
const errorLink = onError(({ graphQLErrors, networkError, ...rest }) => {
  console.error('#################### GQL Error  ####################')

  if (graphQLErrors != null) {
    graphQLErrors?.forEach(({ message, locations, path }) => {
      console.error({
        message,
        locations,
        path
      })
    })
  }

  console.error(rest.operation.query.loc)

  if (networkError != null) {
    console.error('#################### Network error  ####################')

    console.error({
      name: networkError.name,
      detail: JSON.stringify(networkError)
    })
  }
})

export const graphqlClient = new ApolloClient({
  link: from([errorLink, httpLinkPro]),
  cache: new InMemoryCache({
    addTypename: true,
    typePolicies: {
      // Query: {
      //   fields: {
      //     getUserMediaPagination: {
      //       keyArgs: ['userUuid']
      //       // merge: (existing = [], incoming, { args }) => {
      //       //   console.log('#cach merge ', args, incoming)
      //       //   // return [...existing, ...incoming]
      //       // }
      //     }
      //   }
      // },
      CragsNear: {
        keyFields: ['placeId', '_id']
      },
      Area: {
        keyFields: ['uuid']
      },
      AreaMetadata: {
        keyFields: ['areaId']
      },
      Organization: {
        keyFields: ['orgId']
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
      },
      MediaWithTags: {
        keyFields: ['id'],
        fields: {
          entityTags: {
            merge: (existing = [], incoming) => {
              return incoming
            }
          }
        }
      }
      // UserMedia: {
      //   keyFields: ['userUuid']
      // },
      // MediaEdge: {
      //   keyFields: ['cursor']
      // }
      // MediaConnection: {
      //   merge: (existing = { edges: [] }, incoming, { args }) => {
      //     console.log('#cach merge ', args, incoming)
      //     const temp = [...existing.edges, ...incoming.edges]

      //     return { ...existing, edges: temp }
      //   }
      // }
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
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: openCollectiveUri,
    fetchOptions: {
      next: { revalidate: 3600 }
    }
  })
})
