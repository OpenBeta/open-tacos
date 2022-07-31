import { NextApiHandler } from 'next'
import withAuth from '../withAuth'
import createMetadataClient, { Auth0UserMetadata } from './metadataClient'

interface ReifiedMetaCollections {
  climbCollections: {[key: string]: string[]}
  areaCollections: {[key: string]: string[]}
}

function reifyCollections (meta: Auth0UserMetadata): ReifiedMetaCollections {
  return {
    climbCollections: ((meta?.collections?.climbCollections) != null) ? meta?.collections?.climbCollections : {},
    areaCollections: ((meta?.collections?.areaCollections) != null) ? meta?.collections?.areaCollections : {}
  }
}

/** This can be called repeatedly without causing problems.
 * we interpret the favs as a set, so it's kinda whatever.
 */
const handler: NextApiHandler<any> = async (req, res) => {
  try {
    const metadataClient = await createMetadataClient(req)
    if (metadataClient == null) throw new Error('Can\'t create ManagementAPI client')

    /**
     * within this closure, this meta object will be mutated a fair bit.
     * At the very end, it will be committed (except in the case of a GET request)
     */
    const meta = await metadataClient.getUserMetadata()
    const collections = reifyCollections(meta)
    if (req.method === 'GET') {
      // This is a bit of a hack. We don't want to return the whole metadata object.
      // We just want to return the favs.
      res.json(collections)
      res.end()
      return
    }

    const body = JSON.parse(req.body)

    if (body.climbId === undefined && body.areaId === undefined) {
      throw new Error('No climb or area id provided. At least one must be supplied')
    }

    if (body.collection === undefined) {
      body.collections = 'favourites'
    }

    // I'm hoping this is an edge-case. Can't say for sure if devs should allow users to functionally
    // access this endpoint without doing SOME checks first. Still, the guards are in place.
    if (meta?.nick === null || meta === undefined) {
      throw new Error('Un-authenticated users cannot have favs')
    }

    /** For a given key, compute the value of IDS in that collection,
     * or initialize it if it doesn't exist. This mutates the meta state rather
     * than returning results directly.
     * the reqKey is the pointer to data in the request that we want to inject
     */
    function addToFavs (reqKey: string, metaKey: string, collectionScope: keyof ReifiedMetaCollections): void {
      const idToAdd = body[reqKey]
      if (idToAdd === undefined) {
        // This is not necessarily an error. not all params need to be extant.
        // Error handling is done further up, we just return here
        return
      }

      // reminder: using sets to help guarentee string uniqueness
      const favs: Set<string> = new Set(collections[collectionScope][metaKey])
      if (typeof idToAdd === 'string') {
        favs.add(idToAdd)
      } else {
        idToAdd.forEach((id: string) => {
          favs.add(id)
        })
      }

      // Maximum number of favs is 500.
      // I have only set this as a guardrail, chosen arbitrarily.
      if (favs.size >= 500) {
        return
      }

      collections[collectionScope][metaKey] = Array.from(favs)
    }

    /** For a given key (key to request query param as well as key to metadata
     * json serialization) do the necessary computations to add this ID to the
     * favourites that this user has previously specified - this one. */
    function removeFromFavs (reqKey: string, metaKey: string, collectionScope: keyof ReifiedMetaCollections): void {
      const idToRemove = body[reqKey]
      if (
        idToRemove === undefined ||
        collections[collectionScope][metaKey] === undefined
      ) {
        // Nothing to remove.
        return
      }

      const favs: Set<string> = new Set(collections[collectionScope][metaKey])
      if (typeof idToRemove === 'string') {
        favs.delete(idToRemove)
      } else {
        idToRemove.forEach((id: string) => {
          favs.delete(id)
        })
      }

      collections[collectionScope][metaKey] = Array.from(favs)
    }

    // The two entities we support right now are Climbs and Areas
    // Just as an intellectual exercise, we could do the following for... media or something:
    // addToFavs('mediaId', 'favMedia')
    if (req.method === 'POST') {
      addToFavs('climbId', body.collection, 'climbCollections')
      addToFavs('areaId', body.collection, 'areaCollections')
    } else if (req.method === 'DELETE') {
      removeFromFavs('climbId', body.collection, 'climbCollections')
      removeFromFavs('areaId', body.collection, 'areaCollections')
    }

    // make the meta collections object reflect the new one
    meta.collections = collections // mutate actual meta object
    // Commit the changes to the user's metadata
    await metadataClient.updateUserMetadata(meta)
    res.status(200).end()
  } catch (e) {
    // Could not add this climb to the user's favourites.
    // Almost certainly a programmer error.
    res.status(500).json({ error: e.message })
  }
}

export default withAuth(handler)
