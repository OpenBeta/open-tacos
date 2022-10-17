import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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

let PopupTagList

describe('MobilePopupTagMenu', () => {
  beforeAll(async () => {
    // why async import?  see https://github.com/facebook/jest/issues/10025#issuecomment-716789840
    const module = await import('../TagList')
    PopupTagList = module.MobilePopupTagList
  })

  test('Tag with permission to delete', async () => {
    const user = userEvent.setup()
    render(
      <PopupTagList
        list={TAG_DATA}
        imageInfo={IMAGE_DATA}
      />
    )

    expect(AddTagMock).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button'))

    // TODO: how to verify popup content being rendered (portalled) to document.body?
    // See https://github.com/radix-ui/primitives/discussions/1130
  })
})
