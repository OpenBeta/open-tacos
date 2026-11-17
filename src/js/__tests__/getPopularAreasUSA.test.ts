import { AreaType } from '../types'
import {
  buildUSATableOfContent,
  DEFAULT_MAX_AREAS_PER_STATE,
  USAToCProps
} from '../graphql/getPopularAreasUSA'

describe('buildUSATableOfContent', () => {
  const createMockArea = (name: string, state: string, uuid: string): AreaType => ({
    id: uuid,
    uuid,
    areaName: name,
    pathTokens: ['USA', state, name],
    ancestors: ['usa-uuid', `${state.toLowerCase()}-uuid`, uuid],
    totalClimbs: 100,
    density: 1.0
  } as unknown as AreaType)

  const mockData: USAToCProps = {
    area: {
      uuid: 'usa-uuid',
      children: [
        { areaName: 'California', uuid: 'california-uuid', totalClimbs: 1000 },
        { areaName: 'Colorado', uuid: 'colorado-uuid', totalClimbs: 800 }
      ]
    },
    areas: [
      createMockArea('Yosemite', 'California', 'ca-1'),
      createMockArea('Joshua Tree', 'California', 'ca-2'),
      createMockArea('Tahoe', 'California', 'ca-3'),
      createMockArea('Bishop', 'California', 'ca-4'),
      createMockArea('Red Rocks CA', 'California', 'ca-5'),
      createMockArea('Mammoth', 'California', 'ca-6'),
      createMockArea('Boulder Canyon', 'Colorado', 'co-1'),
      createMockArea('Eldorado Canyon', 'Colorado', 'co-2')
    ]
  }

  it('limits child areas per state to default max (5)', () => {
    const stateMap = buildUSATableOfContent(mockData)

    const ca = stateMap.get('california')
    expect(ca).toBeDefined()
    expect(ca?.name).toEqual('California')
    expect(ca?.areas.length).toBe(DEFAULT_MAX_AREAS_PER_STATE)
    expect(ca?.areas.map(a => a.areaName)).toEqual([
      'Yosemite',
      'Joshua Tree',
      'Tahoe',
      'Bishop',
      'Red Rocks CA'
    ])

    const co = stateMap.get('colorado')
    expect(co).toBeDefined()
    expect(co?.areas.length).toBe(2)
  })

  it('respects a custom limit when passed', () => {
    const stateMap = buildUSATableOfContent(mockData, 2)

    const ca = stateMap.get('california')
    expect(ca?.areas.length).toBe(2)
    expect(ca?.areas.map(a => a.areaName)).toEqual(['Yosemite', 'Joshua Tree'])
  })

  it('allows unlimited child areas when maxAreasPerState <= 0', () => {
    const stateMap = buildUSATableOfContent(mockData, 0)

    const ca = stateMap.get('california')
    expect(ca?.areas.length).toBe(6)
  })

  it('ignores areas with less than 2 pathTokens or unknown states', () => {
    const dataWithInvalid: USAToCProps = {
      area: {
        uuid: 'usa-uuid',
        children: [{ areaName: 'California', uuid: 'california-uuid', totalClimbs: 500 }]
      },
      areas: [
        {
          id: 'invalid-1',
          uuid: 'invalid-1',
          areaName: 'Root Area',
          pathTokens: ['USA'],
          ancestors: ['usa-uuid'],
          totalClimbs: 50
        } as unknown as AreaType,
        {
          id: 'invalid-2',
          uuid: 'invalid-2',
          areaName: 'Unknown State Area',
          pathTokens: ['USA', 'NonExistentState', 'Crag'],
          ancestors: ['usa-uuid', 'unknown-uuid', 'crag-uuid'],
          totalClimbs: 50
        } as unknown as AreaType,
        createMockArea('Yosemite', 'California', 'ca-1')
      ]
    }

    const stateMap = buildUSATableOfContent(dataWithInvalid)
    const ca = stateMap.get('california')
    expect(ca?.areas.length).toBe(1)
    expect(ca?.areas[0].areaName).toBe('Yosemite')
  })
})
