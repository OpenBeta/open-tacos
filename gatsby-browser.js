import './src/styles/global.css'

import React from 'react'
import { Auth0Provider } from '@auth0/auth0-react'
import { navigate } from 'gatsby'
import { Auth0Config } from './src/js/constants'

const onRedirectCallback = (appState) => {
  // Use Gatsby's navigate method to replace the url
  navigate(appState?.returnTo || '/', { replace: true })
}

export const wrapRootElement = ({ element }) => {
  return (
    <Auth0Provider
      domain={Auth0Config.domain}
      clientId={Auth0Config.clientId}
      redirectUri={Auth0Config.redirectUri}
      audience={Auth0Config.audience}
      scope={Auth0Config.scope}
      onRedirectCallback={onRedirectCallback}
    >
      {element}
    </Auth0Provider>
  )
}
