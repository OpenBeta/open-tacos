import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from './FormHelper'
import Input from '../Input'

test('Input sends value to form', async () => {
  const user = userEvent.setup()

  const submitFn = jest.fn()
  const inputFieldName = 'fullName'
  const defaultValues = { [inputFieldName]: '' }
  const errorMsg = 'A name is required!'
  render(
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
  expect(screen.getByLabelText(errorMsg)).not.toBeUndefined()

  // enter some text
  await user.type(screen.getByRole('textbox', { name: /Full name/ }), 'bart simpson')

  // Error message is cleared
  expect(screen.queryByLabelText(errorMsg)).toBeNull()

  // submit again
  await user.click(screen.getByRole('button', { name: 'OK' }))

  expect(submitFn).toHaveBeenCalledTimes(1)
  expect(submitFn).toBeCalledWith(
    { [inputFieldName]: 'bart simpson' },
    expect.anything()) // we don't care about form 'ref' param but we have to ack it
})
