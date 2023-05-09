import { v4 } from 'uuid'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Tag from '../Tag'
import { EntityTag } from '../../../js/types'

const TAG_DATA: EntityTag = {
  id: v4(),
  type: 0,
  climbName: 'Big roof',
  areaName: 'The Hanging Garden',
  ancestors: [v4().toString(), v4().toString()].join(','),
  targetId: v4().toString()
}

test.skip('Default tag', () => {
  render(
    <Tag tag={TAG_DATA} onDelete={jest.fn()} />)

  const aTag = screen.getByRole('link')
  expect(aTag).not.toBeNull()
  // @ts-expect-error
  expect(aTag).toHaveTextContent(TAG_DATA.climbName)
  expect(aTag.getAttribute('href')).toEqual('/climbs/' + TAG_DATA.targetId)

  expect(screen.queryByRole('button')).toBeNull()
})

test.skip('Tag with permission to delete', async () => {
  const user = userEvent.setup()
  const onDeleteFn = jest.fn()
  render(
    <Tag
      tag={TAG_DATA}
      onDelete={onDeleteFn}
      isAuthorized
      showDelete
    />)

  await user.click(screen.getByRole('button'))
  expect(onDeleteFn).toHaveBeenCalledTimes(1)
})
