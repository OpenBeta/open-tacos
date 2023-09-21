import { v4 } from 'uuid'
import { render, screen } from '@testing-library/react'

import { MediaWithTags } from '../../../js/types'
import { MobileMediaCardProps } from '../MobileMediaCard'

const TAG_DATA: MediaWithTags = {
  id: v4(),
  mediaUrl: 'https://example.com/1.jpg',
  width: 1200,
  height: 960,
  format: 'jpeg',
  size: 30000,
  uploadTime: new Date(),
  entityTags: [{
    id: v4(),
    type: 0,
    climbName: 'Big roof',
    areaName: 'The Hanging Garden',
    ancestors: [v4().toString(), v4().toString()].join(','),
    targetId: v4().toString()
  }]
}

jest.mock('../../../js/graphql/Client')

const AddTagMock = jest.fn((props) => <div>mocked</div>)
jest.mock('../AddTag', () => ({
  __esModule: true,
  default: AddTagMock
}))

jest.mock('../../../js/hooks/useMediaCmd', () => ({
  __esModule: true,
  default: () => jest.fn()
}))

let MobileMediaCard: React.FC<MobileMediaCardProps>

describe('MobileMediaCard', () => {
  beforeAll(async () => {
    // why async import?  see https://github.com/facebook/jest/issues/10025#issuecomment-716789840
    const module = await import('../MobileMediaCard')
    MobileMediaCard = module.default
  })

  test('Tag with permission to delete', async () => {
    render(
      <MobileMediaCard
        mediaWithTags={TAG_DATA}
        isAuthorized
      />
    )

    // verify the image
    expect(screen.getByRole('img')).toBeInTheDocument()

    // verify list of tags
    expect(screen.getByRole('link', { name: TAG_DATA.entityTags[0].climbName })).toBeInTheDocument()

    // verify tag popup menu
    expect(screen.getByRole('button', { name: 'tag menu' })).toBeInTheDocument()

    // verify timestamp
    expect(screen.getByLabelText('timestamp'))
      .toHaveTextContent(/second.? ago$/i) // actual result usually X seconds ago
  })
})
