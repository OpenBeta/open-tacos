import { CheckBadgeIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { ReactNode } from 'react'
import { LeanAlert, AlertAction } from '../../ui/micro/AlertDialogue'

export const SuccessAlert: React.FC<any> = ({ description, children }) => {
  return (
    <LeanAlert
      closeOnEsc={false}
      icon={<CheckBadgeIcon className='stroke-success w-10 h-10' />}
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
