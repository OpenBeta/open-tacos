import React, { ReactElement } from 'react'

interface OnboardingChecklistProps {
  mediaCount: number
  hasUsername: boolean
}

const OnboardingChecklist = ({ mediaCount, hasUsername }: OnboardingChecklistProps): ReactElement => {
  const checklistItems = [
    {
      text: 'Add 3 photos to complete your profile',
      isCompleted: mediaCount >= 3
    },
    {
      text: 'Create a username',
      isCompleted: hasUsername
    }
  ]

  return (
    <div className='flex justify-center mt-8 text-secondary text-sm whitespace-normal px-4 lg:px-0'>
      <div className='border rounded-md px-6 py-2 shadow'>
        <ul className='list-disc'>
          {checklistItems.map((item, index) => (
            <li key={index}>
              {item.text} {item.isCompleted && <span>&#10004;</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default OnboardingChecklist
