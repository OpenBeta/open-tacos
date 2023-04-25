import React from 'react'
import '@testing-library/jest-dom/extend-expect'

import { render } from '@testing-library/react'
import forOwnerOnly from '../../auth/forOwnerOnly'
import usePermissions from '../../hooks/auth/usePermissions'
import { IUserProfile, WithOwnerProfile } from '../../types/User'

// Mock the usePermissions hook
jest.mock('../../hooks/auth/usePermissions')

const dummyOwnerProfile: IUserProfile = {
  uuid: '12345678-1234-1234-1234-123456789012',
  roles: ['user'],
  loginsCount: 1,
  name: 'John Doe',
  nick: 'johndoe',
  bio: 'Climber and outdoor enthusiast',
  website: 'https://johndoe.com',
  ticksImported: true,
  collections: {
    climbCollections: {
      'John\'s Climbs': ['climb1', 'climb2', 'climb3']
    },
    areaCollections: {
      'John\'s Areas': ['area1', 'area2', 'area3']
    }
  },
  email: 'john@example.com',
  avatar: 'https://example.com/john/avatar.jpg',
  authProviderId: 'auth0|123456789012345678901234'
}
// Create a mock component to be used with forOwnerOnly
const MockComponent: React.FC<WithOwnerProfile> = () => <div>Mock Component</div>

// Create a component wrapped with forOwnerOnly
const WrappedComponent = forOwnerOnly(MockComponent)

describe('forOwnerOnly', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render the component if isAuthorized is true', async () => {
    (usePermissions as jest.Mock).mockReturnValue({ isAuthorized: true })

    const { container } = render(<WrappedComponent ownerProfile={dummyOwnerProfile} />)
    expect(container).toHaveTextContent('Mock Component')
  })

  it('should not render the component if isAuthorized is false', () => {
    (usePermissions as jest.Mock).mockReturnValue({ isAuthorized: false })

    const { container } = render(<WrappedComponent ownerProfile={dummyOwnerProfile} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('should not render the component if the WrappedComponent is null', () => {
    type Fn<P> = (props: P) => JSX.Element | null

    const NullWrappedComponent = forOwnerOnly(null as unknown as Fn<WithOwnerProfile>)
    expect(NullWrappedComponent({ ownerProfile: dummyOwnerProfile })).toBeNull()
  })
})
