import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client'
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support'
import { dynamicTagsLink } from './dynamicTagsLink'

const uri: string = process.env.NEXT_PUBLIC_API_SERVER ?? ''

if (uri === '' || uri == null) {
  throw new Error('NEXT_PUBLIC_API_SERVER is not set')
}

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
