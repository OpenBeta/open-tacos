import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import RandomRouteCard from '../RandomRouteCard'

test('RandomRouteCard has route_name', () => {
  const mocked = {
    frontmatter: {
      type: { sport: 1 },
      route_name: 'Sample Test',
      yds: '5.10a'
    },
    pathTokens: [
      'USA',
      'Oregon',
      'Central Oregon',
      'Smith Rock',
      'Shipwreck Wall - East Face',
      'marooned'
    ],
    slug: '/climbs/1234'
  }

  render(<RandomRouteCard climb={mocked} />)

  expect(screen.getByRole('heading', { hidden: true })).toHaveTextContent(mocked.frontmatter.route_name)
})
