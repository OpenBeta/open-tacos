import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm, FormProvider } from 'react-hook-form'

import RadioGroup from '../RadioGroup'

test('RadioGroup can change state', async () => {
  const user = userEvent.setup()

  const { result } = renderHook(() => useForm({ defaultValues: { testRadioGroup: '1' } }))
  const { handleSubmit } = result.current
  const submitFn = jest.fn()
  render(
    <FormProvider {...result.current}>
      <form onSubmit={handleSubmit(submitFn)}>
        <RadioGroup
          groupLabel='Test group'
          name='testRadioGroup'
          labels={['one', 'two']}
          values={['1', '2']}
        />
        <button type='submit'>OK</button>
      </form>
    </FormProvider>
  )

  await user.click(screen.getByRole('button'))

  expect(submitFn).toHaveBeenCalledTimes(1)
  expect(submitFn).toBeCalledWith({ testRadioGroup: '1' }, expect.anything())

  await user.click(screen.getByLabelText('two'))
  await user.click(screen.getByRole('button'))

  expect(submitFn).toBeCalledWith({ testRadioGroup: '2' }, expect.anything())
})
