import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import BreadCrumbs from '../BreadCrumbs'

const pathTokens = [
  'US',
  'California',
  'Yosemite Valley'
]

const ancestors = [
  '1',
  '2',
  '3'
]

test('Breadcrumbs don\'t add href to last link', () => {
  const element = render(<BreadCrumbs pathTokens={pathTokens} ancestors={ancestors} />)
  expect(element.getByLabelText('area-breadcrumbs'))
    .toHaveTextContent('US/California/Yosemite Valley')

  expect(screen.getByRole('link', { name: /California/i })).toHaveAttribute('href', '/crag/2')

  // the last entry shouldn't be a link
  const notExisted = element.queryByRole('link', { name: /Yosemite Valley/i })
  expect(notExisted).toBeNull()
})

test('Breadcrumbs show correct items on climb page', () => {
  render(<BreadCrumbs pathTokens={pathTokens} ancestors={ancestors} isClimbPage />)
  const actual = screen.getByLabelText('area-breadcrumbs')
  expect(actual)
    .toHaveTextContent('US/California/Yosemite Valley')

  expect(screen.getByRole('link', { name: /US/i })).toHaveAttribute('href', '/crag/1')
  expect(screen.getByRole('link', { name: /California/i })).toHaveAttribute('href', '/crag/2')
  // last link should be 'crag'
  expect(screen.getByRole('link', { name: /Yosemite Valley/i })).toHaveAttribute('href', '/crag/3')
})
