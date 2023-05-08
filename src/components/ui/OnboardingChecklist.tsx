import React, { ReactElement } from 'react'

interface OnboardingChecklistProps {
  mediaCount: number
  hasUsername: boolean
}

const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({ mediaCount, hasUsername }): ReactElement => {
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
    <div className='flex justify-center text-secondary text-sm whitespace-normal px-4 lg:px-0'>
      <div className='px-6 py-2 shadow'>
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
