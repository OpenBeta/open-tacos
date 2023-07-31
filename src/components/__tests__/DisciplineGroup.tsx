import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import DisciplineGroup from '../DisciplineGroup'
import { ClimbDisciplineRecord } from '../../js/types'

const defaultTypes = {
  trad: true,
  sport: true,
  tr: true,
  bouldering: false // <--- False
}
let climbTypes: Partial<ClimbDisciplineRecord>
const setClimbTypes = (value: Partial<ClimbDisciplineRecord>): void => {
  climbTypes = value
}

const getButton = (label: string): HTMLElement => screen.getByLabelText(label)

describe('DisciplineGroup', () => {
  beforeEach(() => {
    climbTypes = {
      trad: true,
      sport: true,
      tr: true,
      bouldering: false // <--- False
    }
  })
  it('renders component without error', () => {
    render(<DisciplineGroup defaultTypes={defaultTypes} climbTypes={climbTypes} setClimbTypes={setClimbTypes} />)
  })

  it('renders correct default initial values', () => {
    render(<DisciplineGroup defaultTypes={defaultTypes} climbTypes={climbTypes} setClimbTypes={setClimbTypes} />)

    expect(getButton('Sport')).toBeChecked()
    expect(getButton('Trad')).toBeChecked()
    expect(getButton('Top rope')).toBeChecked()
    expect(getButton('Bouldering')).not.toBeChecked()
  })

  it('changes all states on click', async () => {
    const mockOnChange = jest.fn()
    render(
      <DisciplineGroup
        defaultTypes={defaultTypes}
        climbTypes={climbTypes}
        setClimbTypes={mockOnChange}
      />)

    expect(getButton('Sport')).toBeChecked()
    expect(getButton('Trad')).toBeChecked()
    expect(getButton('Top rope')).toBeChecked()
    expect(getButton('Bouldering')).not.toBeChecked()

    await userEvent.click(getButton('Sport'))

    expect(mockOnChange).toBeCalledWith({
      sport: false,
      trad: true,
      tr: true,
      bouldering: false
    }
    )

    await userEvent.click(getButton('Trad'))

    expect(mockOnChange).toBeCalledWith({
      sport: true,
      trad: false,
      tr: true,
      bouldering: false
    }
    )

    await userEvent.click(getButton('Top rope'))
    expect(mockOnChange).toBeCalledWith({
      sport: true,
      trad: true,
      tr: false,
      bouldering: false
    }
    )

    await userEvent.click(getButton('Bouldering'))
    expect(mockOnChange).toBeCalledWith({
      sport: true,
      trad: true,
      tr: true,
      bouldering: true
    }
    )
  })

  it('resets to defaultTypes when component regenerated', async () => {
    const { unmount } = render(
      <DisciplineGroup
        defaultTypes={defaultTypes}
        climbTypes={climbTypes}
        setClimbTypes={setClimbTypes}
      />)

    await userEvent.click(getButton('Sport'))
    await userEvent.click(getButton('Trad'))
    await userEvent.click(getButton('Top rope'))
    await userEvent.click(getButton('Bouldering'))

    unmount()

    // initial render
    const { rerender } = render(
      <DisciplineGroup
        defaultTypes={defaultTypes}
        climbTypes={climbTypes}
        setClimbTypes={setClimbTypes}
      />)

    // re-render when useEffect runs
    rerender(<DisciplineGroup
      defaultTypes={defaultTypes}
      climbTypes={climbTypes}
      setClimbTypes={setClimbTypes}
             />)

    // States should be restored
    expect(getButton('Sport')).toBeChecked()
    expect(getButton('Trad')).toBeChecked()
    expect(getButton('Top rope')).toBeChecked()
    expect(getButton('Bouldering')).not.toBeChecked()
  })
})
