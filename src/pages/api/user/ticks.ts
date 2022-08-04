import { NextApiHandler } from 'next'
import csv from 'csvtojson'
import withAuth from '../withAuth'
import createMetadataClient, { Auth0UserMetadata, Tick } from './metadataClient'
import axios, { AxiosInstance } from 'axios'
import { v5 as uuidv5, NIL } from 'uuid'

interface TickObjectType { [key: string]: Tick[] }
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
// interface BodyType {
//   climbId?: string | string[]
//   areaId?: string | string[]
//   collection?: string | string[]
// }

const MP_ID_REGEX: RegExp = /route\/(?<id>\d+)\//

/**
 *
 * @param mpUrl
 * takes in the Mountain project URL from the .csv file
 * @returns
 * The mountain project URL converted to a Open-Tacos UUID OR -1 if not found
 */

function extractId (mpUrl: string): string | Number {
  const match = MP_ID_REGEX.exec(mpUrl)
  if (match?.groups?.id != null) {
    const openTacoId: string = uuidv5(match.groups.id, NIL)
    return openTacoId
  } else {
    return -1
  }
}

function reifyTickCollection (meta: Auth0UserMetadata): TickCollection {
  return {
    tickCollections: ((meta?.collections?.tickCollections) != null)
      ? meta?.collections?.tickCollections
      : Object.create({}) as TickObjectType
  }
}

function backToJSONSafe (ticks: TickCollection): APITickCollection {
  return {
    tickCollections: ticks.tickCollections
  }
}

async function getMPTicks (uid: string): Promise<any[]> {
  const mpClient: AxiosInstance = axios.create({
    baseURL: 'https://www.mountainproject.com/user'
  })
  const res = await mpClient.get(`${uid}/tick-export`)
  if (res.status === 200) {
    const data = await csv({
      // output: "csv",
    })
      .fromString(res.data)
      .subscribe((csvLine) => {
        csvLine.mp_id = extractId(csvLine.URL)
      })

    return data
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
    if (req.method === 'GET') {
      // This is a bit of a hack. We don't want to return the whole metadata object.
      // We just want to return the favs.
      res.json(backToJSONSafe(collections))
      res.end()
      return
    } else if (req.method === 'PUT') {
      // fetch data from mountain project here
      const uid: string = JSON.parse(req.body)
      // build object and store in meta data
      if (uid.length > 0) {
        const ret = await getMPTicks(uid)
        ret.forEach((tick) => {
          const newTick: Tick = {
            name: tick.Route,
            notes: tick.notes,
            uuid: tick.mp_id,
            style: tick.Style,
            attemptType: tick['Lead Style'],
            dateClimbed: tick.Date,
            grade: tick.Rating
          }
          // check to see if tick for the climb exists in tick collections
          if (tick.mp_id in collections.tickCollections) { collections.tickCollections[tick.mp_id].push(newTick) } else collections.tickCollections[tick.mp_id] = [newTick]
        })

        meta.collections = {
          tickCollections: collections.tickCollections
        }
        await metadataClient.updateUserMetadata(meta)
        res.status(200).json({ tickCollections: collections.tickCollections })
      }
    }
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
export default withAuth(handler)
