import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import { MiniCrumbs } from '../BreadCrumbs'

const pathTokens = [
  'US',
  'Washington',
  'Southwest Cascades',
  'Columbia Gorge',
  'Beacon Rock',
  'South Face'
]

test('MiniCrumbs show correct items (default)', () => {
  const element = render(<MiniCrumbs pathTokens={pathTokens} />)
  expect(element.getByLabelText('area-minicrumbs'))
    .toHaveTextContent('Washington ... / Beacon Rock / South Face')
})

test('MiniCrumbs show correct items (skipLast = true)', () => {
  const element = render(<MiniCrumbs pathTokens={pathTokens} skipLast />)
  expect(element.getByLabelText('area-minicrumbs'))
    .toHaveTextContent('Washington ... / Beacon Rock')
})
