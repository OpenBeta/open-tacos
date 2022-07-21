import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import MobileNavBar from '../MobileNavBar'

test('MNavBar mobile', () => {
  const element = render(
    <MobileNavBar
      home={<div>home</div>}
      branding={<div>logo</div>}
      search={<div>search</div>}
      more={<div>more</div>}
      profile={<nav>my profile</nav>}
    />
  )

  expect(element.getByText('home'))
    .toHaveTextContent('home')

  expect(element.getByText('logo'))
    .toHaveTextContent('logo')

  expect(element.getByText('search'))
    .toHaveTextContent('search')

  expect(element.getByText('more'))
    .toHaveTextContent('more')

  expect(element.getByRole('navigation'))
    .toHaveTextContent('my profile')
})
