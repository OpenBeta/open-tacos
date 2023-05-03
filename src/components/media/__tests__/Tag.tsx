import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Tag from '../Tag'

const TAG_DATA = [
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

test.skip('Default tag', () => {
  render(
    <Tag
      tag={TAG_DATA[0]}
      onDelete={jest.fn()}
    />)

  const aTag = screen.getByRole('link')
  expect(aTag).not.toBeNull()
  expect(aTag).toHaveTextContent(TAG_DATA[0].climb.name)
  expect(aTag.getAttribute('href')).toEqual('/climbs/' + TAG_DATA[0].destination)

  expect(screen.queryByRole('button')).toBeNull()
})

test.skip('Tag with permission to delete', async () => {
  const user = userEvent.setup()
  const onDeleteFn = jest.fn()
  render(
    <Tag
      tag={TAG_DATA[0]}
      onDelete={onDeleteFn}
      isAuthorized
      showDelete
    />)

  await user.click(screen.getByRole('button'))
  expect(onDeleteFn).toHaveBeenCalledTimes(1)
})
