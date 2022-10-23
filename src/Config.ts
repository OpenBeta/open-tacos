const checkAndPrintWarning = (name: string, value?: string): string => {
  if (value == null) {
    throw new Error(`## Error: '${name}' not defined ##`)
  }
  return value
}

export const NEXT_PUBLIC_MAPBOX_API_KEY = checkAndPrintWarning(
  'NEXT_PUBLIC_MAPBOX_API_KEY', process.env.NEXT_PUBLIC_MAPBOX_API_KEY)

interface AUTH_CONFIG_SERVER_TYPE {
  issuer: string
  clientId: string
  clientSecret: string
  mgmtClientId: string
  mgmtClientSecret: string
  nextauthSecret: string
}

let AUTH_CONFIG_SERVER: AUTH_CONFIG_SERVER_TYPE | undefined

if (typeof window === 'undefined') {
  AUTH_CONFIG_SERVER = {
    issuer: checkAndPrintWarning('AUTH0_DOMAIN', process.env.AUTH0_DOMAIN),
    clientId: checkAndPrintWarning('AUTH0_CLIENT_ID', process.env.AUTH0_CLIENT_ID),
    clientSecret: checkAndPrintWarning('AUTH0_CLIENT_SECRET', process.env.AUTH0_CLIENT_SECRET),
    mgmtClientId: checkAndPrintWarning('AUTH0_MGMT_CLIENT_ID', process.env.AUTH0_MGMT_CLIENT_ID),
    mgmtClientSecret: checkAndPrintWarning('AUTH0_MGMT_CLIENT_SECRET', process.env.AUTH0_MGMT_CLIENT_SECRET),
    nextauthSecret: checkAndPrintWarning('NEXTAUTH_SECRET', process.env.NEXTAUTH_SECRET)
  }
} else {
  AUTH_CONFIG_SERVER = undefined
}

export { AUTH_CONFIG_SERVER }
