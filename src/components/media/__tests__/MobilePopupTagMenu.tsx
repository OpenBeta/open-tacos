import { v4 } from 'uuid'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MediaWithTags } from '../../../js/types'
import { TagListProps } from '../TagList'

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

let PopupTagList: React.FC<TagListProps>

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
        mediaWithTags={TAG_DATA}
        isAuthorized // Make sure we check that AddTag component is also rendered.
      />
    )

    // isAuthorized = true, check to see if AddTag is rendered
    expect(AddTagMock).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button'))

    // TODO: how to verify popup content being rendered (portalled) to document.body?
    // See https://github.com/radix-ui/primitives/discussions/1130
  })
})
