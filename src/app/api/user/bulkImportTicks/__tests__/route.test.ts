/**
 * @jest-environment node
 */
import axios from 'axios'
import { NextRequest } from 'next/server'
import { graphqlClient } from '../../../../../js/graphql/Client'
import { updateUser } from '../../../../../js/auth/ManagementClient'
import { PREDEFINED_HEADERS } from '../../../../../js/auth/withUserAuth'
import { POST } from '../route'

jest.mock('../../../../../js/auth/withUserAuth', () => ({
  withUserAuth: (handler: any) => handler,
  PREDEFINED_HEADERS: {
    user_uuid: 'x-user-uuid',
    auth0_id: 'x-auth0-id',
    access_token: 'x-access-token'
  }
}))

jest.mock('axios')
jest.mock('../../../../../js/auth/ManagementClient', () => ({
  updateUser: jest.fn().mockResolvedValue({})
}))
jest.mock('../../../../../js/graphql/Client', () => ({
  graphqlClient: {
    mutate: jest.fn().mockResolvedValue({})
  }
}))

/** Build a minimal POST NextRequest with the required auth headers and a profileUrl body. */
function buildRequest (profileUrl: string): NextRequest {
  return new NextRequest('http://localhost:3000/api/user/bulkImportTicks', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      [PREDEFINED_HEADERS.user_uuid]: 'test-user-uuid',
      [PREDEFINED_HEADERS.auth0_id]: 'auth0|123456'
    },
    body: JSON.stringify({ profileUrl })
  })
}

describe('POST /api/user/bulkImportTicks – regression tests for Issue #1456', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('stores dateClimbed as noon UTC and preserves the date across North American timezones', async () => {
    const mockCsv = [
      'Date,Route,Rating,Notes,URL,Pitches,Location,Avg Stars,Your Stars,Style,Lead Style,Route Type,Your Rating,Length,Rating Code',
      '2026-04-03,I Am The Walrus,5.10a,Great route,https://www.mountainproject.com/route/105748490/i-am-the-walrus,1,Red River Gorge,3.5,4,Send,Redpoint,Sport,5.10a,70,1050'
    ].join('\n')

    ;(axios.create as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({ status: 200, data: mockCsv })
    })

    const response = await POST(buildRequest('105748490/user-name'))
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ count: 1 })

    expect(graphqlClient.mutate).toHaveBeenCalledTimes(1)
    const { variables: { input: importedTicks } } = (graphqlClient.mutate as jest.Mock).mock.calls[0][0]

    expect(importedTicks).toHaveLength(1)
    const tick = importedTicks[0]
    expect(tick.name).toBe('I Am The Walrus')
    expect(tick.source).toBe('MP')

    // Core fix assertion: dateClimbed must be stored at noon UTC, not midnight UTC.
    expect(tick.dateClimbed).toBeInstanceOf(Date)
    expect(tick.dateClimbed.toISOString()).toBe('2026-04-03T12:00:00.000Z')

    // Across all North American timezones the date must display as April 3, not April 2.
    const usTimezones = [
      'America/New_York', // EDT UTC-4
      'America/Chicago', // CDT UTC-5
      'America/Denver', // MDT UTC-6
      'America/Los_Angeles', // PDT UTC-7
      'America/Anchorage', // AKDT UTC-8
      'Pacific/Honolulu' // HST UTC-10
    ]
    for (const timeZone of usTimezones) {
      expect(tick.dateClimbed.toLocaleDateString('en-US', { timeZone })).toBe('4/3/2026')
    }

    expect(updateUser).toHaveBeenCalledWith('auth0|123456', { ticksImported: true })
  })

  it('silently skips rows with an impossible date and imports only valid rows', async () => {
    const mockCsv = [
      'Date,Route,Rating,Notes,URL,Pitches,Location,Avg Stars,Your Stars,Style,Lead Style,Route Type,Your Rating,Length,Rating Code',
      // Row 1: impossible date (February 31 doesn't exist)
      '2026-02-31,Nonexistent Route,5.9,,https://www.mountainproject.com/route/105000000/nonexistent-route,1,Crag,3,3,Solo,,Sport,5.9,60,900',
      // Row 2: valid date
      '2026-04-03,I Am The Walrus,5.10a,Great route,https://www.mountainproject.com/route/105748490/i-am-the-walrus,1,Red River Gorge,3.5,4,Send,Redpoint,Sport,5.10a,70,1050'
    ].join('\n')

    ;(axios.create as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({ status: 200, data: mockCsv })
    })

    const response = await POST(buildRequest('105748490/user-name'))
    expect(response.status).toBe(200)
    // Only the valid row should be counted; the impossible-date row is silently skipped.
    expect(await response.json()).toEqual({ count: 1 })

    const { variables: { input: importedTicks } } = (graphqlClient.mutate as jest.Mock).mock.calls[0][0]
    expect(importedTicks).toHaveLength(1)
    expect(importedTicks[0].name).toBe('I Am The Walrus')
    expect(importedTicks[0].dateClimbed.toISOString()).toBe('2026-04-03T12:00:00.000Z')
    expect(importedTicks[0].dateClimbed.toLocaleDateString('en-US', { timeZone: 'America/Denver' })).toBe('4/3/2026')
  })

  it('returns 500 if required headers or payload are missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/user/bulkImportTicks', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({})
    })

    const response = await POST(req)
    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ error: 'Internal Server Error' })
  })
})
