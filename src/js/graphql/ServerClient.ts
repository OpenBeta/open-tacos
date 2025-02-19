import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client'
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support'
import { dynamicTagsLink } from './dynamicTagsLink'

const uri: string = process.env.OPENBETA_API_SERVER ?? ''

if (uri === '' || uri == null) {
  throw new Error('OPENBETA_API_SERVER is not set')
}

console.log('#######################################################################')
console.log(' API Server', uri)
console.log('#######################################################################')

const httpLink = new HttpLink({ uri })

/**
 * Apollo client to be used in React Server Components.
 */
export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([dynamicTagsLink, httpLink])
  })
})
