# Openbeta Organization Abstraction
Kao, Mar 9th

## Background
Current user data model, stored with third-party provider Auth0.
```
IUserProfile { // src/js/types/User.ts
  email?: string
  avatar?: string
  authProviderId: string

  IUserMetadata {
    IReadOnlyUserMetadata {
      uuid: string
      roles: string[]
      loginsCount: number
    }
    IWritableUserMetadata {
      name: string
      nick: string
      bio: string
      website?: string
      ticksImported?: boolean
      collections?: {
        climbCollections?: { [key: string]: string[] }
        areaCollections?: { [key: string]: string[] }
      }
    }
  }
}
```

## Proposal
### Organizations
We need a new entity for LCOs. To future-proof this construct, I propose we make it a subtype of a more general construct called an "Organization". It'll have the following data model which is similar in structure to `IUserProfile`:
```
IOrganization: {
  type: enum  // one of {"local_climbing_organization", …}
  avatar?: string
  // Organizations have no login, therefore no email/authProviderId as with IUserProfile.
  // It is their administrators that can log in and take actions.

  IOrganizationMetadata {
    IReadOnlyOrganizationMetadata {
      uuid: string
    }
    IWritableOrganizationMetadata {
      name: string
      nick: string
      bio: string
      website?: string
      email?: string   // Email moved here since it is no longer an identifier for the model.
      donationLink?: string
      hardwareReportLink?: string
      instagramLink?: string
      collections?: {
        areaCollections?: { [key: string]: string[] }
      }
    }
  }  
}
```

One cool idea here: We could also enable users to be associated with organizations. This could be self-declared or supplied by the organization. This would create stronger network effects and accelerate user growth. However, to prevent scope creep, we should take this idea for now.

### Organization Administrators
We need to be able to record that some users are organization administrators. We will allow multiple administrators per organization with no hierarchy amongst these admins. A user can also be admins of multiple organizations at once. For now, the site admin will manually assign users to be organization administrators.

These administrators will have the following abilities:
- Update the organization's `IWritableOrganizationMetadata` via the organization profile page. This includes updating donation/Instagram/email links, and associating the `Organization` with various climbing areas by adding those areas to `areaCollections`.
- Post notices on routes in their area (eg land-use warnings, raptor closures, etc)

### Users as Organization Administrators
Question here is how to record that a user is an organization administrator. 

1. Expand `roles`
The first option is to expand `user_metadata.roles` which currently supports only two values:
- `user_admin`, which is a site-wide admin capable of viewing all user metadata (src/pages/api/basecamp/users.ts), and migrating other users (src/pages/api/basecamp/migrate.ts)
- `editor`, which all users currently get by default, (see `AuthProvider/postLoginAction/setDefaultRoles-step0.js`) but doesn't seem to control anything.
The tricky thing is that an `organization_administrator` role requires us to specify which organizations they are administrators of, so just adding another possible value to `user_metadata.roles` is insufficient. Instead perhaps we could update `roles` from `[]string` to `[]object` so that we record things in this way:
```
  roles: [
    {role: user_admin},
    {role: organization_admin,
     organization: <bcc_uuid>},
    {role: organization_admin,
     organization: <action_committee_of_eldorado_uuid>},
  ] 
```

2. New `organization_admin` field
Another option is to create a new `user_metadata` field: `user_metadata.organization_admin: []string` where the strings are uuids of the organizations the user administers. This would create an additional layer of role-like controls, which may be confusing in future.

3. Hybrid
I think this is the worst of both worlds, but listing for completeness. Add 'organization_admin' as a possible value for `role`, and then create another `organization_admin` field to track which organizations they are admins of.

Overall, I'm leaning toward option 2. Option 1 introduces a polymorphic data structure in the objects in the array, which can be the source of many errors. Option 2's risk is creating bloat in the top layer of the data model, and interference between multiple role-like systems. But if it's just two systems, we should be fine. In future, more site-level roles could just slot into the `roles` field. Implementing area admins could be more tricky since they would require a user<>area map analogous to user<>organization map. But I guess then having an `area_admin` field just like `organization_admin` isn't that bad either.

------

## Update 2023-03-22
After discussions with Viet and Colin, we have a revised proposal for how to deal with roles and permissions. For some background, we use JWT token-based authentication. We have sessions, but these are on the client side so it's not considered the old-school server-side session-based authentication.

### Existing Authentication Mechanism
The whole system is organized using the `next-auth` library with `Auth0` as our (only) third-party [authentication provider](https://next-auth.js.org/providers/auth0). `Auth0` stores our user data (separate from the rest of the route/climbing data which is stored in our self-managed MongoDB instance) and on successful login, stuffs that data into two JWTs ("id", to identify the user, and "access", to determine what the user can access) which are saved in the user's browser. When the user is redirected back to our page, `next-auth` in our client application parses the JWTs and uses the data within to populate context variables in the user's session.

In more detail:

1. User clicks on the "Become a contributor" button and is redirected to an `Auth0` hosted page to log in. 
2. `Auth0` servers verify their login credentials and call the `postLoginActions` we've uploaded into the `Auth0` dashboard. (See `AuthProvider/postLoginAction/`, also [Auth0 docs](https://auth0.com/docs/customize/actions/flows-and-triggers/login-flow/event-object)). Our main action gives users the `editor` role if they don't already have it. We do this by inserting it as custom claims into the outgoing "access" and "id" JWT tokens.
3. `Auth0` returns a JWT to the user's browser and redirects the user back to our page.
4. On our client application, the `next-auth` framework calls the JWT callback (See src/pages/api/auth/[...nextauth].ts). Profile information from the JWT is reformatted and saved into a new JWT.
5. It then calls the Session callback (same file). Data from the JWT is loaded into `next-auth` session variables that our application can access freely.
6. At various points in our app, we refer to the session variables to check if the user should be allowed to perform various actions eg `if (session?.user.metadata?.roles?.includes('user_admin') ?? false) { ... }`  (src/pages/api/basecamp/users.ts). In the graphql server, we also parse the JWT in the headers of the API requests, check that it isn't tempered with and deduce the roels of the user. See (https://github.com/OpenBeta/openbeta-graphql/blob/develop/src/auth/middleware.ts)

### Revised Proposal
#### 1. New `org_admin` role
We adopt Option 3 from above where we add `org_admin` as a new role alongside `editor` and `user_admin`, and then we add another parameter to track the orgs that the user is admin of.

Despite originally calling it the worst of the three options, it fits best into our existing frameworks. Option 1 forces us to have a complicated data-structure inside `roles`, but what we know now that we didn't before, is that `roles` gets stuffed into JWTs that get passed around and parsed alot! We don't want to have to transmit a big token, and replicate complicated parsing logic in all the places it gets read. In this vein, we're even going to shorten `organization_admin` in the original proposal to `org_admin`. 

This also helps with portability: `roles` is also something that gets stored in `Auth0`. We want something that can be migrated easily and that other providers will not have a problem with. Array of strings is the least likely to cause problems.

We also don't want to adopt Option 2 and avoid adding a role when organization admin is so clearly a role. Yes, it's a bit superfluous because you can find out if someone is an org admin by checking if they have the array of org_ids they are admins of. But doing this keeps the whole role-based permissioning mental model consistent.


#### 2. New `org_admin:org_ids` field
We need to map users not just to roles, but also different roles within different organizations. `Auth0` has [organization functionality](https://auth0.com/docs/manage-users/organizations/using-tokens) but it is inadequate for what we want because while it enables users to log in through different organizations, they can only be in one organization at a time. For us, a user may be an admin of multiple LCOs, and they should be able to access all their LCO's data through a single log-in. `Auth0`'s mechanism is to insert an `org_id` parameter into the JWTs.

The proposal here is to add `org_admin:org_ids` as a field in the user model that is stored in `Auth0`. When the user logs in, we'll have `Auth0` add it as a field in the access token JWT.

Hopefully, this becomes a design pattern: Whenever a role needs to attach additional data, we can use `<role>:<data_type>` as the param name.

The resulting access token should look something like this:
```
{
  "iss": "https://openbeta.auth0.com/",
  "sub": "auth0|602c0dcab993d10073daf680",
  "aud": [
    "https://openbeta-api/",
    "https://openbeta.auth0.com/userinfo"  
  ],
  "iat": 1616499255,
  "exp": 1616585655,
  "azp": "ENDmmAJsbwI1hOG1KPJddQ8LHjV6kLkV",
  "scope": "openid profile email",
  "https://tacos.openbeta.io/roles": [ // Custom Claim
    "editor",
    "org_admin",
  ],
  "org_admin:org_ids": [ // Custom Claim
    "org_9ybsU1dN2dKfDkBi",
    "org_t89djT8didj350gd",
  ],
}
```

#### 3. Organization access control
In the app, we'll load these into the session variables as we currently do (Step 5). When the user attempts to edit an organization profile page, we check two conditions in both the frontend and the GraphQL server: 
1. Does the user have an `org_admin` role? 
2. Does their `org_admin:org_ids` include the org they are trying to access?

#### 4. Climbing area access control
Climbing area data is already editable by everyone by default. We want to introduce a new "notices" section for displaying nesting closures, landuse issues, etc. and this would require the user to be an admin of an org associated with the area in order to update.

We propose to use the following logic to determine if a user can edit these notices:
```
  user 
  -> has `org_admin` role
  -> for each `org_id` in `org_admin:org_ids`
  -> for each org's `areaCollections`
  -> if area under consideration is a child area, allow admin-editing
```

Concretely, this logic will be encoded in a new [GraphQL Shield](https://the-guild.dev/graphql/shield/docs) rule that guards a new `notices` Mongo collection. The rule will probably run a fairly complicated GraphQL query to map from org_id to child areas.