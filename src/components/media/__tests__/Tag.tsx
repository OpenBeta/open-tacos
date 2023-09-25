import { v4 } from 'uuid'
import ''
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { BaseTag, LocationTag, UsernameTag } from '../Tag'
import { EntityTag } from '../../../js/types'

afterEach(cleanup)

const TAG_DATA: EntityTag = {
  id: v4(),
  type: 0,
  climbName: 'Big roof',
  areaName: 'The Hanging Garden',
  ancestors: [v4().toString(), v4().toString()].join(','),
  targetId: v4().toString()
}

describe('BaseTag', () => {
  it('renders without crashing', () => {
    render(<BaseTag>does it render?</BaseTag>)
    const baseElement = screen.getByTestId('base-tag') // You'll need to add a data-testid="base-tag" to your BaseTag component
    expect(baseElement).toBeInTheDocument()
  })

  it('renders with provided children', () => {
    render(<BaseTag>Sample Content</BaseTag>)
    expect(screen.getByText('Sample Content')).toBeInTheDocument()
  })

  it('applies size correctly', () => {
    render(<BaseTag size='md'>Medium Size</BaseTag>)
    const baseElement = screen.getByText('Medium Size')
    expect(baseElement).toHaveClass('gap-1') // This assumes that 'gap-1' is the class applied for medium size. Adjust if needed.

    render(<BaseTag size='lg'>Large Size</BaseTag>)
    const largeElement = screen.getByText('Large Size')
    expect(largeElement).toHaveClass('badge-lg gap-2') // Adjust if needed.
  })
})

describe('LocationTag', () => {
  it('Default tag', () => {
    render(<LocationTag mediaId='1234' tag={TAG_DATA} onDelete={jest.fn()} />)
    const aTag = screen.getByRole('link')
    expect(aTag).toHaveTextContent(TAG_DATA.climbName as string)
    expect(aTag.getAttribute('href')).toEqual('/climbs/' + TAG_DATA.targetId)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('Tag with permission to delete', async () => {
    const user = userEvent.setup()
    const onDeleteFn = jest.fn()
    render(<LocationTag mediaId='12345' tag={TAG_DATA} onDelete={onDeleteFn} isAuthorized showDelete />)
    await user.click(screen.getByRole('button'))
    expect(onDeleteFn).toHaveBeenCalledTimes(1)
  })
})

describe('UsernameTag', () => {
  it('renders without crashing', () => {
    render(<UsernameTag username='testuser' />)
    const linkElement = screen.getByText('testuser')
    expect(linkElement).toBeInTheDocument()
  })

  it('does not render if username is undefined', () => {
    const { container } = render(<UsernameTag username={undefined as any} />)
    expect(container.firstChild).toBeNull()
  })

  it('does not render if username is an empty string', () => {
    const { container } = render(<UsernameTag username='' />)
    expect(container.firstChild).toBeNull()
  })
})
