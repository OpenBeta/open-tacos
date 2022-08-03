import { NextApiHandler } from 'next'
import { getSession } from 'next-auth/react'
import withAuth from '../withAuth'
import { getUserCollectionsByUuid } from '../../../js/auth/ManagementClient'
import { Session } from 'next-auth'
// type CollectionType = string[]
// type CollectionCollectionType = Map<string, CollectionType>
/**
 * Collections are defined as being extremely generic. These are the
 * specific entity collections that are favourites. Ticks, for example,
 * may vary in the type of data that needs to be enumerated.
 */
// interface ReifiedFavouriteCollections {
//   climbCollections: CollectionCollectionType
//   areaCollections: CollectionCollectionType
// }

export interface APIFavouriteCollections {
  climbCollections: {[key: string]: string[] | undefined }
  areaCollections: {[key: string]: string[] | undefined}
}

/** Body params we expect to recieve */
// interface BodyType {
//   climbId?: string | string[]
//   areaId?: string | string[]
//   collection?: string | string[]
// }

// function reifyCollections (meta: Auth0UserMetadata): ReifiedFavouriteCollections {
//   return {
//     climbCollections: ((meta?.collections?.climbCollections) != null)
//       ? new Map(Object.entries(meta?.collections?.climbCollections))
//       : new Map(Object.entries({})) as CollectionCollectionType,

//     areaCollections: ((meta?.collections?.areaCollections) != null)
//       ? new Map(Object.entries(meta?.collections?.areaCollections))
//       : new Map(Object.entries({})) as CollectionCollectionType
//   }
// }

// function backToJSONSafe (collections: ReifiedFavouriteCollections): APIFavouriteCollections {
//   return {
//     climbCollections: Object.fromEntries(collections.climbCollections),
//     areaCollections: Object.fromEntries(collections.areaCollections)
//   }
// }

/** This can be called repeatedly without causing problems.
 * we interpret the favs as a set, so it's kinda whatever.
 */
const handler: NextApiHandler<any> = async (req, res) => {
  try {
    const session = await getSession({ req })
    if (session == null) {
      return res.status(401).redirect(307, '/api/auth/signin')
    }
    switch (req.method) {
      case 'GET': {
        console.log('loading collections from Auth0')
        const data = await loadUserCollections(req, session)
        res.status(200).json(data)
        return
      }
      case 'POST': {
        console.log('update collections')
        res.status(200).end()
        return
      }
    }
    res.status(200).end()
  } catch (e) {
    // Could not add this climb to the user's favourites.
    // Almost certainly a programmer error.
    res.status(500).json({ error: e.message })
  }
}

export default withAuth(handler)

const loadUserCollections = async (req, session: Session): Promise<any> => {
  return await getUserCollectionsByUuid(session.user.metadata.uuid)
}
