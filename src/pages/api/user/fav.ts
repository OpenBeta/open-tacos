import { NextApiHandler } from 'next'
import withAuth from '../withAuth'
import createMetadataClient, { Auth0UserMetadata } from './metadataClient'

type CollectionType = string[]
type CollectionCollectionType = Map<string, CollectionType>
/**
 * Collections are defined as being extremely generic. These are the
 * specific entity collections that are favourites. Ticks, for example,
 * may vary in the type of data that needs to be enumerated.
 */
interface ReifiedFavouriteCollections {
  climbCollections: CollectionCollectionType
  areaCollections: CollectionCollectionType
}

export interface APIFavouriteCollections {
  climbCollections: { [key: string]: string[] | undefined }
  areaCollections: { [key: string]: string[] | undefined }
}

/** Body params we expect to recieve */
interface BodyType {
  climbId?: string | string[]
  areaId?: string | string[]
  collection?: string | string[]
}

function reifyCollections (meta: Auth0UserMetadata): ReifiedFavouriteCollections {
  return {
    climbCollections: ((meta?.collections?.climbCollections) != null)
      ? new Map(Object.entries(meta?.collections?.climbCollections))
      : new Map(Object.entries({})) as CollectionCollectionType,

    areaCollections: ((meta?.collections?.areaCollections) != null)
      ? new Map(Object.entries(meta?.collections?.areaCollections))
      : new Map(Object.entries({})) as CollectionCollectionType
  }
}

function backToJSONSafe (collections: ReifiedFavouriteCollections): APIFavouriteCollections {
  return {
    climbCollections: Object.fromEntries(collections.climbCollections),
    areaCollections: Object.fromEntries(collections.areaCollections)
  }
}

/** This can be called repeatedly without causing problems.
 * we interpret the favs as a set, so it's kinda whatever.
 */
const handler: NextApiHandler<any> = async (req, res) => {
  try {
    const metadataClient = await createMetadataClient(req, res)
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
      res.json(backToJSONSafe(collections))
      res.end()
      return
    }

    const body: BodyType = JSON.parse(req.body)

    if (body.climbId === undefined && body.areaId === undefined) {
      throw new Error('No climb or area id provided. At least one must be supplied')
    }

    if (body.collection === undefined) {
      body.collection = 'favourites'
    }

    // I'm hoping this is an edge-case. Can't say for sure if devs should allow users to functionally
    // access this endpoint without doing SOME checks first. Still, the guards are in place.
    if (meta?.nick === null || meta === undefined) {
      throw new Error('Un-authenticated users cannot have favs')
    }

    /** This piece of code operated within the given request context, and does
     * not know or understand which collections in the 'collections' object are
     * supposed to be collections of favourites.
     *
     * There is therefore nothing except developer oversight to prevent collections
     * of entites from being conflated.
     *
     * _metaKey is the key in the collections object that we want to mutate
     * [collectionScope][_metaKey] is the general bucket of favourites, for example.
     * ['areaCollections']['favourites'] is the general bucket of favourites, for example.
     *
     * reqKey can be considered the entity type.
     */
    function addRemoveFavourite (
      reqKey: keyof typeof body,
      collectionScope: keyof ReifiedFavouriteCollections,
      metaKey: string
    ): void {
      // ensure that an id has been supplied for this entity type
      const targetEntity = body[reqKey]
      if (targetEntity === undefined) return

      // we mutate as a set, but store as an array
      const favs: Set<string> = new Set(collections[collectionScope].get(metaKey))
      const op = req.method === 'DELETE'
        ? (id: string) => favs.delete(id)
        : (id: string) => favs.add(id)

      // Rest params may be lists, we can handle that easily
      if (typeof targetEntity === 'string') {
        op(targetEntity)
      } else {
        targetEntity.forEach((id: string) => {
          op(id)
        })
      }

      collections[collectionScope].set(metaKey, Array.from(favs))
    }

    // The two entities we support right now are Climbs and Areas
    // Just as an intellectual exercise, we could do the following for... media or something:
    // addToFavs('mediaId', 'favMedia')
    if (typeof body.collection === 'string') {
      addRemoveFavourite('climbId', 'climbCollections', body.collection)
      addRemoveFavourite('areaId', 'areaCollections', body.collection)
    } else {
      body.collection.forEach((targetCollection) => {
        addRemoveFavourite('climbId', 'climbCollections', targetCollection)
        addRemoveFavourite('areaId', 'areaCollections', targetCollection)
      })
    }

    // make the meta collections object reflect the new one
    // TS should flag if we make any massive mistake here
    meta.collections = {
      climbCollections: Object.fromEntries(collections.climbCollections),
      areaCollections: Object.fromEntries(collections.areaCollections)
    }

    // Commit the changes to the user's metadata
    await metadataClient.updateUserMetadata(meta)
    res.status(200).end()
  } catch (e: any) {
    // Could not add this climb to the user's favourites.
    // Almost certainly a programmer error.
    res.status(500).json({ error: e.message })
  }
}

export default withAuth(handler)
