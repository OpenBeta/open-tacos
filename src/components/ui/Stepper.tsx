import React, { useState } from 'react'

interface StepperProps {
  currentStep: number
  steps: string[]
  onStepClick: (step: number) => void
  children?: React.ReactNode
}

const Stepper: React.FC<StepperProps> = ({ currentStep, steps, onStepClick, children }) => {
  const [previousStep, setPreviousStep] = useState(0)

  const handleClick = (index: number): void => {
    setPreviousStep(currentStep)
    onStepClick(index)
  }

  return (
    <div className='flex flex-col w-[100%]'>
      {steps.map((step, index) => (
        <div key={index} className={`relative h-fit mb-4 ${index === currentStep ? 'after:h-[calc(100%-2.45rem)]' : ''}`}>
          <div
            role='button'
            className='flex items-center hover:bg-gray-200 hover:text-gray-800 rounded-md focus:outline-none'
            onClick={() => handleClick(index)}
          >
            <div
              className={`relative w-10 h-10 flex items-center justify-center rounded-full cursor-pointer ${
                index === currentStep ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-800'
              }`}
              data-testid={index === currentStep ? 'completed-step' : 'inactive-step'}
            >
              <span>{index + 1}</span>
            </div>
            <span className='ml-3'>{step}</span>
          </div>
          <div
            className={`overflow-hidden min-w-full transition-all duration-500 ease-in-out ${
              index === currentStep
                ? 'h-auto pb-6 opacity-100'
                : index === previousStep
                ? 'h-0 opacity-0'
                : 'h-0 opacity-0'
            }`}
          >
            {index === currentStep && children}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Stepper
