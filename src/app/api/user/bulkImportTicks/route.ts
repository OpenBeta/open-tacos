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
  style: string | undefined
  attemptType: string | undefined
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
    timeout: 180000
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

// See [Tick Logic](https://github.com/OpenBeta/openbeta-graphql/blob/develop/documentation/tick_logic.md) for info on all the logic in this file.
function trueBoulderTick (style: string, leadStyle: string, routeType: string): boolean {
  return routeType.includes('Boulder') && ((leadStyle ?? '') === '') && ['Flash', 'Send', 'Attempt'].includes(style)
}

function convertMPattemptType (style: string, leadStyle: string, routeType: string): string | undefined {
  if (trueBoulderTick(style, leadStyle, routeType)) {
    return style === '' ? undefined : style
  } else {
    switch (leadStyle) {
      case '':
        return undefined
      case 'Fell/Hung':
        return 'Attempt'
      default:
        return leadStyle
    }
  }
}

function convertMPTickStyle (style: string, leadStyle: string, routeType: string): string | undefined {
  if (trueBoulderTick(style, leadStyle, routeType)) {
    return 'Boulder'
  } else {
    return style === '' ? undefined : style
  }
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
      style: convertMPTickStyle(tick.Style, tick['Lead Style'], tick['Route Type']),
      attemptType: convertMPattemptType(tick.Style, tick['Lead Style'], tick['Route Type']),
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
