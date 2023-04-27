import React from 'react'

interface StepperProps {
  currentStep: number
  steps: string[]
}

const Stepper: React.FC<StepperProps> = ({ currentStep, steps }) => {
  return (
    <div className='flex items-center'>
      {steps.map((step, index) => {
        return (
          <React.Fragment key={index}>
            <div
              data-testid={index < currentStep - 1 ? 'completed-step' : index === currentStep - 1 ? 'current-step' : 'inactive-step'}
              className={`relative w-10 h-10 flex items-center justify-center text-white rounded-full ${
              index < currentStep ? 'bg-green-500' : 'bg-gray-300'
            }`}
            >
              {index + 1}
            </div>
            {index !== steps.length - 1 && (
              <div
                className={`w-10 h-1 ${
                index < currentStep - 1 ? 'bg-green-500' : 'bg-gray-300'
              }`}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default Stepper
