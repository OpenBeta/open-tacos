import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'

const byDisciplineAggBoulder = {
  sport:
    {
      total: 10,
      bands: {
        beginner: 6,
        intermediate: 6,
        expert: 0,
        advance: 0
      }
    },
  trad: null,
  boulder: {
    total: 3,
    bands: {
      beginner: 2,
      intermediate: 0,
      expert: 0,
      advance: 1
    }
  },
  tr: null
}

jest.mock('../../../js/stores/index', () => ({
  cragFiltersStore: {
    get: {
      trad: () => false,
      sport: jest.fn().mockReturnValue(true),
      boulder: jest.fn().mockReturnValue(true),
      tr: () => true,
      freeBandRange: () => [0, 1],
      boulderBandRange: () => [0, 1]
    }
  }
}))

const mockedStore = jest.requireMock('../../../js/stores/index')

let DTable

beforeAll(async () => {
  const module = await import('../DTable')
  DTable = module.default
})

describe('DTable', () => {
  test('DTable renders without crashing', () => {
    render(<DTable byDisciplineAgg={byDisciplineAggBoulder} />)

    const boulderingRow = screen.getByRole('row', { name: /boulder/i })

    expect(boulderingRow.childNodes.length).toEqual(5)

    expect(boulderingRow.childNodes[0]).toHaveTextContent('boulder')
    expect(boulderingRow.childNodes[1]).toHaveTextContent('2') // Beginner
    expect(boulderingRow.childNodes[2]).toHaveTextContent('0')
    expect(boulderingRow.childNodes[3]).toHaveTextContent('1') // Advanced
    expect(boulderingRow.childNodes[4]).toHaveTextContent('0')

    const sportRow = screen.queryByRole('row', { name: /trad/i })
    expect(sportRow).toBeNull()
  })

  test('DTable highlights my disciplines', () => {
    (mockedStore.cragFiltersStore.get.boulder as jest.Mock).mockReturnValue(false) // user unchecks 'bouldering'
    render(<DTable byDisciplineAgg={byDisciplineAggBoulder} />)

    const boulderingRow = screen.getByRole('row', { name: /boulder/i })
    expect(boulderingRow.childNodes[1]).not.toHaveClass('dtable-highlight')

    const sportRow = screen.getByRole('row', { name: /sport/i })
    expect(sportRow.childNodes[1]).toHaveClass('dtable-highlight')
  })
})
