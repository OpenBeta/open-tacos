import {
  ApolloClient,
  InMemoryCache
} from '@apollo/client'

export const graphqlClient = new ApolloClient({
  uri: process.env.API_SERVER,
  cache: new InMemoryCache()
})
