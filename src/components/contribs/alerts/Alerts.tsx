import { BadgeCheckIcon, ExclamationCircleIcon } from '@heroicons/react/outline'
import { ReactNode } from 'react'
import { LeanAlert, AlertAction } from '../../ui/micro/AlertDialogue'

export const SuccessAlert = ({ description, children }): JSX.Element => {
  return (
    <LeanAlert
      closeOnEsc={false}
      icon={<BadgeCheckIcon className='stroke-success w-10 h-10' />}
      title='Success'
      description={description}
    >
      {children}
    </LeanAlert>
  )
}

interface ErrorAlertProps {
  description: ReactNode
  children?: ReactNode
}
export const ErrorAlert = ({ description, children }: ErrorAlertProps): JSX.Element => {
  return (
    <LeanAlert
      closeOnEsc={false}
      icon={<ExclamationCircleIcon className='stroke-error w-10 h-10' />}
      title='Error'
      description={description}
    >
      {children}
    </LeanAlert>
  )
}

export { AlertAction }
