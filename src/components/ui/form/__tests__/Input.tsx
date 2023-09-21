import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from './FormHelper'
import Input from '../Input'

test.only('Input sends value to form', async () => {
  const user = userEvent.setup()

  const submitFn = jest.fn()// .mockImplementation((e) => e.preventDefault())
  const inputFieldName = 'fullName'
  const defaultValues = { [inputFieldName]: '' }
  const errorMsg = 'A name is required!'
  const { rerender } = render(
    <Form
      onSubmit={submitFn}
      defaultValues={defaultValues}
    >
      <Input
        label='Full name'
        name={inputFieldName}
        registerOptions={{ required: errorMsg }}
      />
    </Form>
  )

  await user.click(screen.getByRole('button', { name: 'OK' }))

  // form submit is blocked
  expect(submitFn).toHaveBeenCalledTimes(0)
  // verify error message
  expect(await screen.findByLabelText(errorMsg)).toBeDefined()
  // expect(screen.getByLabelText(errorMsg)).not.toBeUndefined()

  // enter some text
  await user.type(screen.getByRole('textbox', { name: /Full name/ }), 'bart simpson')

  // Error message is cleared
  expect(screen.queryByLabelText(errorMsg)).toBeNull()

  // submit again
  await user.click(screen.getByRole('button', { name: 'OK' }))

  screen.debug()

  // expect(submitFn).toHaveBeenCalledTimes(1)
  expect(submitFn).toBeCalledWith(
    { [inputFieldName]: 'bart simpson' },
    expect.anything()) // we don't care about form 'ref' param but we have to ack it
})
