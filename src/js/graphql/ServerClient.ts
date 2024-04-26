import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc'

const uri: string = process.env.NEXT_PUBLIC_API_SERVER ?? ''

if (uri === '' || uri == null) {
  throw new Error('NEXT_PUBLIC_API_SERVER is not set')
}

export const { getClient: getClientForServerComponent } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri
      // you can disable result caching here if you want to
      // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
      // fetchOptions: { cache: "no-store" },
    })
  })
})
