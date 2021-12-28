import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Auth0Config } from '../../js/constants'

const Auth0Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()

  /**
   * Allows us to fetch the accessToken that we will need for git gateway.
   */
  const callApi = async () => { // eslint-disable-line no-unused-vars
    const domain = Auth0Config.domain
    try {
      const accessToken = await getAccessTokenSilently({
        audience: `https://${domain}/api/v2/`,
        scope: 'read:current_user'
      })

      const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`

      const metadataResponse = await fetch(userDetailsByIdUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const res = await metadataResponse.json()
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    isAuthenticated && (
      <div className='flex items-center'>
        <img className='w-16 h-16' src={user.picture} alt={user.name} />
        <p className='ml-2'>{user.email}</p>
      </div>
    )
  )
}

export default Auth0Profile
