// Stepper.test.tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect' // Add this line

import Stepper from '../Stepper'

describe('Stepper component', () => {
  const steps = ['Step 1', 'Step 2', 'Step 3']

  it('renders the correct number of steps', () => {
    render(<Stepper currentStep={1} steps={steps} />)

    const stepElements = screen.getAllByText(/\d/)
    expect(stepElements.length).toBe(steps.length)
  })

  it('renders the correct current step', () => {
    const currentStep = 2
    render(<Stepper currentStep={currentStep} steps={steps} />)

    const completedSteps = screen.getAllByTestId('completed-step')
    const expected = currentStep - 1
    expect(completedSteps.length).toBe(expected)

    const currentStepElement = screen.getByText(currentStep.toString())
    expect(currentStepElement).toHaveClass('bg-green-500')
  })

  it('renders the remaining steps as inactive', () => {
    const currentStep = 1
    render(<Stepper currentStep={currentStep} steps={steps} />)

    const remainingSteps = screen.getAllByTestId('inactive-step')
    expect(remainingSteps.length).toBe(steps.length - currentStep)

    remainingSteps.forEach((step) => {
      expect(step).toHaveClass('bg-gray-300')
    })
  })
})
