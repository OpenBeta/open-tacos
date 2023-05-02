import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Stepper from '../Stepper'

describe('Stepper component', () => {
  const steps = ['Step 1', 'Step 2', 'Step 3']
  const onStepClick = jest.fn()

  it('renders the correct number of steps', () => {
    render(<Stepper currentStep={1} steps={steps} onStepClick={onStepClick} />)

    const stepElements = screen.getAllByText((content, element) => {
      return (
        element !== null &&
          element.tagName.toLowerCase() === 'span' &&
          element.parentElement !== null &&
          (element.parentElement.classList.contains('bg-green-500') ||
            element.parentElement.classList.contains('bg-gray-300'))
      )
    }, {})
    expect(stepElements.length).toBe(steps.length)
  })

  it('renders the correct current step', () => {
    const currentStep = 2
    render(<Stepper currentStep={currentStep} steps={steps} onStepClick={onStepClick} />)

    const completedSteps = screen.getAllByTestId('completed-step')
    const expected = currentStep - 1
    expect(completedSteps.length).toBe(expected)

    const currentStepElement = screen.getByText((currentStep + 1).toString())
    const parentElement = currentStepElement.parentElement
    expect(parentElement).toHaveClass('bg-green-500')
  })

  it('renders the remaining steps as inactive', () => {
    const currentStep = 1
    render(<Stepper currentStep={currentStep} steps={steps} onStepClick={onStepClick} />)

    const remainingSteps = screen.getAllByTestId('inactive-step')
    expect(remainingSteps.length).toBe(steps.length - currentStep)

    remainingSteps.forEach((step) => {
      expect(step).toHaveClass('bg-gray-300')
    })
  })
})
