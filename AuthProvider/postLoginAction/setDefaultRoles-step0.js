// dev tenant
const EDITOR_ROLE_ID = 'rol_tSvz1wNjTIn435jY'
// !!!Important!! Uncomment the follow line for prod
// const EDITOR_ROLE_ID = 'rol_0nr4PxnpiXT7KylG'

/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async ({ secrets, user, authorization, stats }, api) => {
  if (!user.email_verified) {
    // force the user to verify email
    const token = api.redirect.encodeToken({
      secret: secrets.nextauthSecret,
      payload: {
        email: user.email
      }
    })

    api.redirect.sendUserTo(secrets.verifyRequestUrl, { query: { session_token: token } })
  }

  const ManagementClient = require('auth0').ManagementClient

  const management = new ManagementClient({
    domain: secrets.domain,
    clientId: secrets.clientId,
    clientSecret: secrets.clientSecret,
    scope: 'update:roles'
  })
  
  const params = { id: user.user_id }
  const data = { roles: [EDITOR_ROLE_ID] }

  try {
    if (user?.email_verified) {
      // FYI: new role won't be immediately available in 'authorization' object
      const currentRoles = authorization?.roles ?? []

      const hasEditorRole = authorization?.roles.some(role => role === 'editor') ?? false
      if (!hasEditorRole) {
        const res = await management.assignRolestoUser(params, data)
        currentRoles.push('editor')
      }
      const ns = 'https://tacos.openbeta.io/'
      api.idToken.setCustomClaim(`${ns}roles`, currentRoles)
      api.accessToken.setCustomClaim(`${ns}roles`, currentRoles)
    }
  } catch (e) {
    console.log(e)
  }
}

/**
* Handler that will be invoked when this action is resuming after an external redirect. If your
* onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
// exports.onContinuePostLogin = async (event, api) => {
// };
