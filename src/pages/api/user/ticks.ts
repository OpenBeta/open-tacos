import { NextApiHandler } from 'next'
import csv from "csvtojson";
import withAuth from '../withAuth'
import createMetadataClient, { Auth0UserMetadata } from './metadataClient'
import { Tick } from './metadataClient'
import axios, { AxiosInstance, AxiosStatic } from "axios";
import { v5 as uuidv5, NIL } from 'uuid'
import { nb } from 'date-fns/locale';


type TickObjectType = { [key: string]: Tick[] }
/**
 * Collections are defined as being extremely generic. These are the
 * specific entity collections that are favourites. Ticks, for example,
 * may vary in the type of data that needs to be enumerated.
 */
interface TickCollection {
  tickCollections: TickObjectType
}

export interface APITickCollection {
  tickCollections: {[key: string]: Tick[] | undefined }
}

/** Body params we expect to recieve */
interface BodyType {
  climbId?: string | string[]
  areaId?: string | string[]
  collection?: string | string[]
}

const MP_ID_REGEX: RegExp = RegExp(/route\/(?<id>\d+)\//);

/**
 * 
 * @param mp_url 
 * takes in the Mountain project URL from the .csv file
 * @returns 
 * The mountain project URL converted to a Open-Tacos UUID OR -1 if not found
 */


function extractId(mp_url: string): string | Number {
    const match = MP_ID_REGEX.exec(mp_url);
    return match && match.groups && match.groups.id ? uuidv5(match.groups.id, NIL) : -1;
  }
  

function reifyTickCollection (meta: Auth0UserMetadata): TickCollection {
    return {
        tickCollections: ((meta?.collections?.tickCollections) != null)
        ? meta?.collections?.tickCollections
        : Object.create({}) as TickObjectType,
  }
}

function backToJSONSafe (ticks: TickCollection): APITickCollection {
  return {
    tickCollections: ticks.tickCollections
  }
}

async function getMPTicks(uid: string) {
    const mpClient: AxiosInstance = axios.create({
        baseURL: "https://www.mountainproject.com/user",
      });
    const res = await mpClient.get(`${uid}/tick-export`);
    if (res && res.status === 200) {
        const data = await csv({
            // output: "csv",
          })
            .fromString(res.data)
            .subscribe((csvLine) => {
              csvLine["mp_id"] = extractId(csvLine["URL"]);
            });
    
          return data;
    
    }
    return []

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
         * In the case of a PUT request, we will import the users data from mountain project
         */
        const meta = await metadataClient.getUserMetadata()
        const collections = reifyTickCollection(meta)
        console.log(collections)
        if (req.method === 'GET') {
            // This is a bit of a hack. We don't want to return the whole metadata object.
            // We just want to return the favs.
            res.json(backToJSONSafe(collections))
            res.end()
            return
        } else if (req.method === 'PUT') {
            //fetch data from mountain project here
            const uid: string = JSON.parse(req.body);
            //build object and store in meta data
            if (uid) {
                const ret = await getMPTicks(uid);
                ret.forEach((tick) => {
                        const newTick: Tick = {
                            name: tick.Route,
                            notes: tick.notes || '',
                            uuid: tick.mp_id,
                            style: tick.Style,
                            attemptType: tick['Lead Style'],
                            dateClimbed: tick.Date,
                            grade: tick.Rating
                        }
                        collections.tickCollections[tick.mp_id].push(newTick)
                })
                //check to see if tick collections exists
                meta.collections = {
                    tickCollections: collections.tickCollections
                }
                await metadataClient.updateUserMetadata(meta)
                res.status(200).end()
            }
        }

        // const body: BodyType = JSON.parse(req.body)

        // if (body.climbId === undefined && body.areaId === undefined) {
        //   throw new Error('No climb or area id provided. At least one must be supplied')
        // }

        // if (body.collection === undefined) {
        //   body.collection = 'favourites'
        // }

        // I'm hoping this is an edge-case. Can't say for sure if devs should allow users to functionally
        // access this endpoint without doing SOME checks first. Still, the guards are in place.
        // if (meta?.nick === null || meta === undefined) {
        //   throw new Error('Un-authenticated users cannot have favs')
        // }

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
        // function addRemoveFavourite (
        //   reqKey: keyof typeof body,
        //   collectionScope: keyof ReifiedFavouriteCollections,
        //   metaKey: string
        // ): void {
        //   // ensure that an id has been supplied for this entity type
        //   const targetEntity = body[reqKey]
        //   if (targetEntity === undefined) return

        //   // we mutate as a set, but store as an array
        //   const favs: Set<string> = new Set(collections[collectionScope].get(metaKey))
        //   const op = req.method === 'DELETE'
        //     ? (id: string) => favs.delete(id)
        //     : (id: string) => favs.add(id)

        //   // Rest params may be lists, we can handle that easily
        //   if (typeof targetEntity === 'string') {
        //     op(targetEntity)
        //   } else {
        //     targetEntity.forEach((id: string) => {
        //       op(id)
        //     })
        //   }

        //   collections[collectionScope].set(metaKey, Array.from(favs))
        // }

        // The two entities we support right now are Climbs and Areas
        // Just as an intellectual exercise, we could do the following for... media or something:
        // addToFavs('mediaId', 'favMedia')
        // if (typeof body.collection === 'string') {

        // } else {

        // }

        // make the meta collections object reflect the new one
        // TS should flag if we make any massive mistake here
        // meta.collections = {
        //   climbCollections: Object.fromEntries(collections.climbCollections),
        //   areaCollections: Object.fromEntries(collections.areaCollections)
        // }

        // Commit the changes to the user's metadata
        // await metadataClient.updateUserMetadata(meta)
        // res.status(200).end()
    } catch (e) {
        // Could not add this climb to the user's favourites.
        // Almost certainly a programmer error.
        res.status(500).json({ error: e.message })
    }
}
export default withAuth(handler)