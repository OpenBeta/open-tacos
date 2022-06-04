import { DefaultUser } from 'next-auth'
import { IUserMetadata } from './User'
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: DefaultUser & {
      metadata: IUserMetadata
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userMetadata: IUserMetadata
  }
}
