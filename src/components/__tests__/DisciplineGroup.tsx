import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import DisciplineGroup from '../DisciplineGroup'

const defaultTypes = {
  trad: true,
  sport: true,
  tr: true,
  bouldering: true
}
let climbTypes
const setClimbTypes = (value): void => {
  climbTypes = value
}

describe('DisciplineGroup', () => {
  beforeEach(() => {
    climbTypes = {
      trad: true,
      sport: true,
      tr: true,
      bouldering: true
    }
  })
  it('renders component without error', () => {
    render(<DisciplineGroup defaultTypes={defaultTypes} climbTypes={climbTypes} setClimbTypes={setClimbTypes} />)
  })

  it('all 4 types selected by default', () => {
    const { container } = render(<DisciplineGroup defaultTypes={defaultTypes} climbTypes={climbTypes} setClimbTypes={setClimbTypes} />)
    expect(container.getElementsByClassName('border-neutral-800').length).toBe(4)
  })

  it('changs values and resets to defaultTypes when component regenerated', async () => {
    const clickButton = async (button): Promise<void> => {
      await userEvent.click(button)
      rerender(<DisciplineGroup defaultTypes={defaultTypes} climbTypes={climbTypes} setClimbTypes={setClimbTypes} />)
    }

    const { container, getByRole, rerender } = render(<DisciplineGroup defaultTypes={defaultTypes} climbTypes={climbTypes} setClimbTypes={setClimbTypes} />)
    expect(container.getElementsByClassName('border-neutral-800').length).toBe(4)

    const sportButton = getByRole('button', { name: /Sport/i })
    const tradButton = getByRole('button', { name: /Trad/i })
    const topRopeButton = getByRole('button', { name: /Top rope/i })

    await clickButton(sportButton)
    await clickButton(tradButton)
    await clickButton(topRopeButton)

    expect(container.getElementsByClassName('border-neutral-800').length).toBe(1)
    await clickButton(topRopeButton)
    expect(container.getElementsByClassName('border-neutral-800').length).toBe(2)

    // cancel and click away functionality.
    const { container: recreatedContainer2, rerender: rerender2 } = render(<DisciplineGroup defaultTypes={defaultTypes} climbTypes={climbTypes} setClimbTypes={setClimbTypes} />)

    // rerender needed so that useEffect [] runs.
    rerender2(<DisciplineGroup defaultTypes={defaultTypes} climbTypes={climbTypes} setClimbTypes={setClimbTypes} />)
    expect(recreatedContainer2.getElementsByClassName('border-neutral-800').length).toBe(4)
  })
})
