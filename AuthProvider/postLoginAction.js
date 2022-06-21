/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async ({ user }, api) => {
  const { v4: uuidv4 } = require('uuid')
  const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator')

  user.user_metadata.nick = user.user_metadata?.nick ?? uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }) // big_red_donkey
  user.user_metadata.bio = user.user_metadata?.bio ?? ''
  user.user_metadata.uuid = user.user_metadata?.uuid ?? uuidv4()
  user.user_metadata.name = user.user_metadata?.name ?? user?.nickname ?? ''

  api.user.setUserMetadata('name', user.user_metadata.name)
  api.user.setUserMetadata('bio', user.user_metadata.bio)
  api.user.setUserMetadata('uuid', user.user_metadata.uuid)
  api.user.setUserMetadata('nick', user.user_metadata.nick)

  const ns = 'https://tacos.openbeta.io/'
  api.idToken.setCustomClaim(ns + 'user_metadata', user.user_metadata)
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
