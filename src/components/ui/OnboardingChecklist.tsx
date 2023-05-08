import React, { ReactElement } from 'react'

interface OnboardingChecklistProps {
  /** The number of media items in the user's profile. */
  mediaCount: number
  /** Whether the user has set a username. */
  hasUsername: boolean
}

/**
 * A component that displays an onboarding checklist.
 * @param {OnboardingChecklistProps} props - The component's properties.
 * @returns {ReactElement} - The component's rendered output.
 */
const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({ mediaCount, hasUsername }: OnboardingChecklistProps): ReactElement => {
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
