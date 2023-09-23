import { render, screen } from '@testing-library/react'
import UsernameTag from '../UsernameTag'

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
