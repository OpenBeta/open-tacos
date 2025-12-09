import { ApolloClient, HttpLink, InMemoryCache, ApolloLink } from '@apollo/client'
import { cache } from 'react'
import { dynamicTagsLink } from './dynamicTagsLink'

const uri: string = process.env.OPENBETA_API_SERVER ?? ''

if (uri === '' || uri == null) {
  throw new Error('OPENBETA_API_SERVER is not set')
}

console.log('#######################################################################')
console.log(' API Server', uri)
console.log('#######################################################################')

const httpLink = new HttpLink({
  uri,
  fetchOptions: {
    signal: AbortSignal.timeout(30000) // 30 second timeout
  }
})

const makeClient = (): ApolloClient<any> => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([dynamicTagsLink, httpLink]),
    ssrMode: true
  })
}

/**
 * Apollo client for React Server Components.
 * Uses React.cache() to share one client instance per request.
 */
export const getClient = cache(makeClient)

/**
 * Apollo client for non-RSC contexts (API routes, auth callbacks).
 * Creates a fresh client per call.
 */
export function getGlobalClient (): ApolloClient<any> {
  return makeClient()
}
