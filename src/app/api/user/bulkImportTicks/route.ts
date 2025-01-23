import csv from 'csvtojson'
import axios, { AxiosInstance } from 'axios'
import { v5 as uuidv5, NIL } from 'uuid'
import { NextRequest, NextResponse } from 'next/server'

import { updateUser } from '@/js/auth/ManagementClient'
import { graphqlClient } from '@/js/graphql/Client'
import { MUTATION_IMPORT_TICKS } from '@/js/graphql/gql/fragments'
import { withUserAuth, PREDEFINED_HEADERS } from '@/js/auth/withUserAuth'

export interface Tick {
  name: string
  notes: string
  climbId: string
  userId: string | undefined
  style: string | null
  attemptType: string | null
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

async function getMPTicks (profileUrl: string): Promise<MPTick[]> {
  const mpClient: AxiosInstance = axios.create({
    baseURL: 'https://www.mountainproject.com/user',
    timeout: 60000
  })
  const res = await mpClient.get(`${profileUrl}/tick-export`)
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

const postHandler = async (req: NextRequest): Promise<any> => {
  const uuid = req.headers.get(PREDEFINED_HEADERS.user_uuid)
  const auth0Userid = req.headers.get(PREDEFINED_HEADERS.auth0_id)
  const payload = await req.json()
  const profileUrl: string = payload.profileUrl

  if (uuid == null || profileUrl == null || auth0Userid == null) {
    // A bug in our code - shouldn't get here.
    return NextResponse.json({ status: 500 })
  }

  // fetch data from mountain project here
  const tickCollection: Tick[] = []
  const ret = await getMPTicks(profileUrl)

  for (const tick of ret) {
    const newTick: Tick = {
      name: tick.Route,
      notes: tick.Notes,
      climbId: tick.mp_id,
      userId: uuid,
      style: tick.Style === '' ? null : tick.Style,
      attemptType: tick['Lead Style'] === '' ? null : tick['Lead Style'],
      dateClimbed: new Date(Date.parse(`${tick.Date}T00:00:00`)), // Date.parse without timezone specified converts date to user's present timezone.
      grade: tick.Rating,
      source: 'MP'
    }
    tickCollection.push(newTick)
  }

  if (tickCollection.length > 0) {
    // send ticks to OB backend
    await graphqlClient.mutate<any, { input: Tick[] }>({
      mutation: MUTATION_IMPORT_TICKS,
      variables: {
        input: tickCollection
      }
    })
  }

  // set the user flag to true, so the popup doesn't show anymore and
  // update the metadata
  // Note: null check is to make TS happy.  We wouldn't get here if session is null.
  await updateUser(auth0Userid, { ticksImported: true })

  return NextResponse.json({ count: tickCollection.length }, { status: 200 })
}

export const POST = withUserAuth(postHandler)
