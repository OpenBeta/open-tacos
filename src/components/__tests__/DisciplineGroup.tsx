import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { act, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import DisciplineGroup from '../DisciplineGroup'

const defaultTypes = {
  trad: true,
  sport: true,
  tr: true,
  bouldering: true
}

let climbTypes = {
  trad: true,
  sport: true,
  tr: true,
  bouldering: true
}

const setClimbTypes = (value): void => {
  climbTypes = value
}

describe('DisciplineGroup', () => {
  it('renders component without error', () => {
    render(<DisciplineGroup defaultTypes={defaultTypes} climbTypes={climbTypes} setClimbTypes={setClimbTypes} />)
  })

  it('all 4 types selected by default', async () => {
    const { container, getByRole, rerender } = render(<DisciplineGroup defaultTypes={defaultTypes} climbTypes={climbTypes} setClimbTypes={setClimbTypes} />)
    expect(container.getElementsByClassName('border-neutral-800').length).toBe(4)

    const sportButton = getByRole('button', { name: /Sport/i })
    console.log(sportButton)

    await userEvent.click(sportButton)

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 3))
    })
    rerender(<DisciplineGroup defaultTypes={defaultTypes} climbTypes={climbTypes} setClimbTypes={setClimbTypes} />)
    expect(container.getElementsByClassName('border-neutral-800').length).toBe(3)

    // expect(container).toMatchSnapshot()
  })

  it('changs values and resets to defaultTypes when component regenerated', () => {
    // caused by cancel or click away
    render(<DisciplineGroup defaultTypes={defaultTypes} climbTypes={climbTypes} setClimbTypes={setClimbTypes} />)
  })
})

// possible tests

// does it render without error
// do all 4 types show by default
// if not matches, does it reset to defaultTypes?
