import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'

import { MediaTagWithClimb, MediaType } from '../../../js/types'

const TAG_DATA: MediaTagWithClimb[] = [
  {
    mediaUuid: '123',
    mediaUrl: 'https://example.com/1.jpg',
    mediaType: 0,
    destType: 0,
    destination: '1',
    uid: '2',
    climb: {
      id: '1',
      name: 'Man\'s best friend'
    }
  }
]

const IMAGE_DATA: MediaType = {
  ownerId: '1',
  mediaId: 'A1',
  filename: 'woof.jpg',
  ctime: new Date(),
  mtime: new Date(),
  contentType: 'image/jpg',
  meta: {}
}

jest.mock('../../../js/graphql/Client')
jest.mock('../../../js/hooks/useDeleteTagBackend')

const AddTagMock = jest.fn((props) => <div>mocked</div>)
jest.mock('../AddTag', () => ({
  __esModule: true,
  default: AddTagMock
}))

const onDelete = jest.fn()

jest.mock('../../../js/hooks/useDeleteTagBackend', () => ({
  __esModule: true,
  default: () => ({ onDelete })
}))

let MobileMediaCard

describe('MobileMediaCard', () => {
  beforeAll(async () => {
    // why async import?  see https://github.com/facebook/jest/issues/10025#issuecomment-716789840
    const module = await import('../MobileMediaCard')
    MobileMediaCard = module.default
  })

  test('Tag with permission to delete', async () => {
    render(
      <MobileMediaCard
        tagList={TAG_DATA}
        imageInfo={IMAGE_DATA}
      />
    )

    // verify the image
    expect(screen.getByRole('img')).toBeInTheDocument()

    // verify list of tags
    expect(screen.getByRole('link', { name: TAG_DATA[0].climb.name })).toBeInTheDocument()

    // verify tag popup menu
    expect(screen.getByRole('button', { name: 'tag menu' })).toBeInTheDocument()

    // verify timestamp
    expect(screen.getByLabelText('timestamp'))
      .toHaveTextContent(/second.? ago$/i) // actual result usually X seconds ago
  })
})
