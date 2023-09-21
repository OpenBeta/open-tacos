import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MobileDialog, DialogContent, DialogTrigger } from '../MobileDialog'

test('MobileDialog smoke test', async () => {
  const user = userEvent.setup()
  render(
    <div style={{ pointerEvents: 'auto' }}>
      <MobileDialog modal>
        <DialogTrigger className='btn'>
          Add
        </DialogTrigger>
        <DialogContent title='Sunshine'>
          <button>Submit</button>
        </DialogContent>
      </MobileDialog>
    </div>)

  // Dialog title shouldn't be there
  expect(screen.queryByLabelText('Sunshine')).toBeNull()

  await user.click(screen.getByRole('button', { name: 'Add' }))

  // does dialog content exist?
  expect(screen.queryByLabelText('Sunshine')).not.toBeNull()
  expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeNull()
  expect(screen.queryByRole('button', { name: 'Close' })).not.toBeNull()

  // close dialog
  await user.click(screen.getByRole('button', { name: 'Close' }))

  // title shouldn't be there
  expect(screen.queryByLabelText('Sunshine')).toBeNull()
})
