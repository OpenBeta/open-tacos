/**
* Handler that will be called during the execution of a PostLogin flow.
* Need to add 'unique-names-generator' dependency.
* See https://auth0.com/docs/customize/actions/manage-dependencies
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async ({ user }, api) => {
  const { v4: uuidv4 } = require('uuid')
  const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator')
  user.user_metadata.nick = user.user_metadata?.nick ?? uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }) // big_red_donkey

  api.user.setUserMetadata('name', user.user_metadata.name || user.name)
  api.user.setUserMetadata('bio', user.user_metadata.bio || 'Short bio.  Chillwave occaecat slow-carb mustache.')
  api.user.setUserMetadata('uuid', user.user_metadata.uuid || uuidv4())
  api.user.setUserMetadata('nick', user.user_metadata.nick)
}
