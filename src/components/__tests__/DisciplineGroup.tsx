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
    const { getByRole } = render(<DisciplineGroup defaultTypes={defaultTypes} climbTypes={climbTypes} setClimbTypes={setClimbTypes} />)
    const sportButton = getByRole('checkbox', { name: /Sport/i })
    const tradButton = getByRole('checkbox', { name: /Trad/i })
    const topRopeButton = getByRole('checkbox', { name: /Top rope/i })

    expect(sportButton).toBeChecked()
    expect(tradButton).toBeChecked()
    expect(topRopeButton).toBeChecked()
  })

  it('changes values and resets to defaultTypes when component regenerated', async () => {
    const clickButton = async (button): Promise<void> => {
      await userEvent.click(button)
      rerender(<DisciplineGroup defaultTypes={defaultTypes} climbTypes={climbTypes} setClimbTypes={setClimbTypes} />)
    }

    const { container, getByRole, rerender, unmount } = render(<DisciplineGroup defaultTypes={defaultTypes} climbTypes={climbTypes} setClimbTypes={setClimbTypes} />)
    expect(container.getElementsByClassName('border-neutral-800').length).toBe(4)

    const sportButton = getByRole('checkbox', { name: /Sport/i })
    const tradButton = getByRole('checkbox', { name: /Trad/i })
    const topRopeButton = getByRole('checkbox', { name: /Top rope/i })

    // click buttons to remove from filter
    // sportButton
    expect(sportButton).toBeChecked()
    await clickButton(sportButton)
    expect(sportButton).not.toBeChecked()

    // tradButton
    expect(tradButton).toBeChecked()
    await clickButton(tradButton)
    expect(tradButton).not.toBeChecked()

    // topRopeButton
    expect(topRopeButton).toBeChecked()
    await clickButton(topRopeButton)
    expect(topRopeButton).not.toBeChecked()
    await clickButton(topRopeButton)
    expect(topRopeButton).toBeChecked()

    // cancel and click away functionality.
    unmount() // cancel/click-away unmounts <DisciplineGroup /> component

    const { rerender: rerender2, getByRole: getByRole2 } = render(<DisciplineGroup defaultTypes={defaultTypes} climbTypes={climbTypes} setClimbTypes={setClimbTypes} />)

    // rerender needed so that useEffect [] runs.
    rerender2(<DisciplineGroup defaultTypes={defaultTypes} climbTypes={climbTypes} setClimbTypes={setClimbTypes} />)

    const sportButton2 = getByRole2('checkbox', { name: /Sport/i })
    const tradButton2 = getByRole2('checkbox', { name: /Trad/i })
    const topRopeButton2 = getByRole2('checkbox', { name: /Top rope/i })
    const boulderingButton2 = getByRole2('checkbox', { name: /Bouldering/i })

    expect(sportButton2).toBeChecked()
    expect(tradButton2).toBeChecked()
    expect(topRopeButton2).toBeChecked()
    expect(boulderingButton2).toBeChecked()
  })
})
