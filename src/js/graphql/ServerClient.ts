import { ApolloLink, HttpLink } from '@apollo/client'
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache
} from '@apollo/client-integration-nextjs'
import { dynamicTagsLink } from './dynamicTagsLink'

const uri: string = process.env.OPENBETA_API_SERVER ?? ''

if (uri === '' || uri == null) {
  throw new Error('OPENBETA_API_SERVER is not set')
}

console.log('#######################################################################')
console.log(' API Server', uri)
console.log('#######################################################################')

const httpLink = new HttpLink({ uri })

// Create a fresh timeout signal for each request
const timeoutLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ fetchOptions = {} }) => ({
    fetchOptions: {
      ...fetchOptions,
      signal: AbortSignal.timeout(30000)
    }
  }))
  return forward(operation)
})

/**
 * Apollo client for React Server Components.
 * Uses registerApolloClient to share one client instance per request.
 */
export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([timeoutLink, dynamicTagsLink, httpLink])
  })
})

/**
 * Apollo client for non-RSC contexts (API routes, auth callbacks).
 * Creates a fresh client per call.
 */
export function getGlobalClient (): ApolloClient<any> {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([timeoutLink, dynamicTagsLink, httpLink])
  })
}
