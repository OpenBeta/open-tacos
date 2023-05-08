import React, { ReactElement } from 'react'

interface OnboardingChecklistProps {
  /** The checklist items to display. */
  checklistItems: ChecklistItem[]
}

interface ChecklistItem {
  /** The text to display for the checklist item. */
  text: string
  /** Whether the checklist item is completed. */
  isCompleted: boolean
}

/**
 * A component that displays an onboarding checklist.
 * @param {OnboardingChecklistProps} props - The component's properties.
 * @returns {ReactElement} - The onboarding checklist.
 */
const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({ checklistItems }: OnboardingChecklistProps): ReactElement => {
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
