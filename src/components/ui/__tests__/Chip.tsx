import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Chip from '../Chip'

test('Chip has route_name', () => {
  const element = render(<Chip type='sport' />)
  expect(element.getByLabelText('climb-discipline')).toHaveTextContent('sport')
})
