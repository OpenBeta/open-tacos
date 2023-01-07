import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InplaceTextInput from '../InplaceTextInput'
import InplaceEditor from '../InplaceEditor'
import { FormHelper } from './FormHelper'

describe('Inplace editor tests', () => {
  test('InplaceTextInput handles user input correctly', async () => {
    const user = userEvent.setup()
    const initialValue = 'My dog also climbs'
    const submitHandlerFn = jest.fn()

    const { rerender } = render(
      <FormHelper initialValue={initialValue} submitHandler={submitHandlerFn}>
        <InplaceTextInput
          name='title'
          editable
          initialValue={initialValue}
          reset={0}
        />
      </FormHelper>)

    await user.type(screen.getByRole('textbox'), 'hello')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(submitHandlerFn).toHaveBeenCalledTimes(1)
    let functionArg = submitHandlerFn.mock.calls[0][0]
    expect(functionArg).toMatchObject(expect.objectContaining({ title: initialValue + 'hello' }))

    submitHandlerFn.mockClear()

    rerender(
      <FormHelper initialValue={initialValue} submitHandler={submitHandlerFn}>
        <InplaceTextInput
          name='title'
          editable
          initialValue={initialValue}
          reset={Date.now()} // will trigger a reset
        />
      </FormHelper>)

    await user.click(screen.getByRole('button'))

    functionArg = submitHandlerFn.mock.calls[0][0]
    expect(functionArg).toMatchObject(expect.objectContaining({ title: initialValue }))
  })

  test('InplaceEditor handles user input correctly', async () => {
    const user = userEvent.setup()
    const initialValue = 'This is **bold**\n\nA [link](https://openbeta.io).'
    const submitHandlerFn = jest.fn()

    render(
      <FormHelper initialValue={initialValue} submitHandler={submitHandlerFn}>
        <InplaceEditor
          name='description'
          editable
          initialValue={initialValue}
          reset={0}
        />
      </FormHelper>)

    await user.type(screen.getByRole('textbox'), 'hello')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(submitHandlerFn).toHaveBeenCalledTimes(1)
    const functionArg = submitHandlerFn.mock.calls[0][0]
    expect(functionArg).toMatchObject(expect.objectContaining({ description: initialValue + 'hello' }))
  })

  test('InplaceEditor renders markdown correctly in preview mode', async () => {
    const initialValue = 'This is **bold**\n\nA [link](https://openbeta.io).'
    const submitHandlerFn = jest.fn()

    render(
      <FormHelper initialValue={initialValue} submitHandler={submitHandlerFn}>
        <InplaceEditor
          name='description'
          editable={false} // Important: set to 'false' will render initialValue as html
          initialValue={initialValue}
          reset={0}
        />
      </FormHelper>)

    expect(screen.queryByText('**bold**')).not.toBeInTheDocument()
    expect(screen.getByText('bold')).toBeInTheDocument()

    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://openbeta.io')
  })
})
