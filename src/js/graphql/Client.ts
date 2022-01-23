import {
  ApolloClient,
  InMemoryCache
} from '@apollo/client'

const uri: string = process.env.NEXT_PUBLIC_API_SERVER
export const graphqlClient = new ApolloClient({
  uri,
  cache: new InMemoryCache(),
  ssrMode: true
})
