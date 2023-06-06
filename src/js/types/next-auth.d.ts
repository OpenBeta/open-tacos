import { DefaultUser } from 'next-auth'
import { IUserMetadata } from './User'
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context.
   * See also https://next-auth.js.org/getting-started/typescript
   */
  interface Session {
    user: DefaultUser & {
      metadata: IUserMetadata
    }
    accessToken: string
    id: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userMetadata: IUserMetadata
    id: string
    accessToken: string
  }
}
