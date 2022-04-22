import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import DTable from '../DTable'

const byDisciplineAggBoulder = {
  __typename: 'CountByDisciplineType',
  sport: null,
  trad: null,
  boulder: {
    __typename: 'DisciplineStatsType',
    total: 3,
    bands: {
      __typename: 'CountByGradeBand',
      advance: 1,
      beginner: 2,
      expert: 0,
      intermediate: 0
    }
  },
  tr: null
}

test('DTable renders without crashing', () => {
  const { container } = render(<DTable byDisciplineAgg={byDisciplineAggBoulder} />)
  expect(true).toBe(true)
  console.log(container)
})
