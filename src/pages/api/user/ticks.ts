import { NextApiHandler } from 'next'
import csv from 'csvtojson'
import withAuth from '../withAuth'
import createMetadataClient, { Tick } from './metadataClient'
import axios, { AxiosInstance } from 'axios'
import { v5 as uuidv5, NIL } from 'uuid'

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

const handler: NextApiHandler<any> = async (req, res) => {
  try {
    const metadataClient = await createMetadataClient(req)
    if (metadataClient == null) throw new Error('Can\'t create ManagementAPI client')
    const meta = await metadataClient.getUserMetadata()
    if (req.method === 'GET') {
      res.end()
      return
    } else if (req.method === 'POST') {
      // fetch data from mountain project here
      const uid: string = JSON.parse(req.body)
      const tickCollection: Tick[] = []
      if (uid.length > 0 && meta.uuid !== undefined) {
        const ret = await getMPTicks(uid)
        ret.forEach((tick) => {
          const newTick: Tick = {
            name: tick.Route,
            notes: tick.notes,
            climbId: tick.mp_id,
            userId: meta.uuid,
            style: tick.Style === '' ? 'N/A' : tick.Style,
            attemptType: tick.Style === '' ? 'N/A' : tick.Style,
            dateClimbed: tick.Date,
            grade: tick.Rating
          }
          tickCollection.push(newTick)
        })

        meta.collections = {
          tickCollections: collections.tickCollections
        }

        // check to see if the ticks imported flag exists, if not create it
        if (meta?.ticksImported != null) meta.ticksImported = true
        else meta.ticksImported = true
        await metadataClient.updateUserMetadata(meta)
        res.status(200).json({ tickCollections: collections.tickCollections })
      }
    }
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: e.message })
  }
}
export default withAuth(handler)
