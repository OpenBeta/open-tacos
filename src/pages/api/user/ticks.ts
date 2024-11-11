import { NextApiHandler } from 'next'
import { getServerSession } from 'next-auth'
import csv from 'csvtojson'
import axios, { AxiosInstance } from 'axios'
import { v5 as uuidv5, NIL } from 'uuid'

import withAuth from '../withAuth'
import { authOptions } from '../auth/[...nextauth]'
import { updateUser } from '@/js/auth/ManagementClient'

export interface Tick {
  name: string
  notes: string
  climbId: string
  userId: string | undefined
  style: string
  attemptType: string
  dateClimbed: Date
  grade: string
  source: string
}

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

interface MPTick {
  mp_id: string // We extract this from the URL -- not supplied in MP's CSV.
  Date: string
  Route: string
  Rating: string
  Notes: string
  URL: string
  Pitches: string
  Location: string
  'Avg Stars': string
  'Your Stars': string
  Style: string
  'Lead Style': string
  'Route Type': string
  'Your Rating': string
  Length: string
  'Rating Code': string
}

async function getMPTicks (uid: string): Promise<MPTick[]> {
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
  if (req.method !== 'POST') res.end()
  const session = await getServerSession(req, res, authOptions)
  if (session == null) res.end()

  const uuid = session?.user.metadata?.uuid
  const uid: string = JSON.parse(req.body)
  if (uuid == null || uid == null) res.status(500)

  // fetch data from mountain project here
  const tickCollection: Tick[] = []
  const ret = await getMPTicks(uid)

  ret.forEach((tick) => {
    const newTick: Tick = {
      name: tick.Route,
      notes: tick.Notes,
      climbId: tick.mp_id,
      userId: uuid,
      style: tick.Style === '' ? 'N/A' : tick.Style,
      attemptType: tick.Style === '' ? 'N/A' : tick.Style,
      dateClimbed: new Date(Date.parse(`${tick.Date}T00:00:00`)), // Date.parse without timezone specified converts date to user's present timezone.
      grade: tick.Rating,
      source: 'MP'
    }
    tickCollection.push(newTick)
  })
  // set the user flag to true, so the popup doesn't show anymore and
  // update the metadata
  // Note: null check is to make TS happy.  We wouldn't get here if session is null.
  if (session != null) {
    await updateUser(session.id, { ticksImported: true })
  }

  res.json({ ticks: tickCollection })
  res.end()
}
export default withAuth(handler)
