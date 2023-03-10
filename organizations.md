# Openbeta Organization Abstraction
Kao, Mar 9th

## Background
Current user data model
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
- `editor`, which doesn't seem to do anything at the moment.
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

