import React from 'react'
import { useRouter } from 'next/router'

import Modal from '../ui/Modal'
import RainIcon from '../../assets/icons/rain.svg'
import { ERROR } from './Editor'

export default function ErrorMessage ({ code, msg, setError }) {
  const router = useRouter()
  const actionOk = {
    text: 'OK',
    action: function () {
      setError(ERROR.NO_ERROR) // allow user to close dialog
    }
  }
  const actionDashboard = {
    text: 'Go to Dashboard',
    action: function () {
      router.push('/dashboard') // direct user to dashboard because there's nothing user can do
    }
  }

  // In the future we can automatically create a branch if there's a commit conflict
  // for now let user close error message and go back to pre-submit state.
  const action =
    code === ERROR.FILE_WRITE_ERROR.code || code === ERROR.FILE_CONFLICT_ERROR.code ? actionOk : actionDashboard
  return (
    <Modal
      isOpen={code !== ERROR.NO_ERROR.code}
      setIsOpen={() => setError(ERROR.NO_ERROR)}
      title='Error'
      description={msg}
      actionOk={action}
      icon={<RainIcon className='h-10 w-10' />}
    />
  )
}
