'use client'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { X } from '@phosphor-icons/react'

export const ReactToastifyProvider: React.FC = () => (
  <ToastContainer
    position='bottom-right'
    autoClose={6000}
    hideProgressBar
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable={false}
    pauseOnHover
    theme='light'
    closeButton={ToastCloseButton}
  />)

const ToastCloseButton: React.FC<any> = ({ closeToast }) => (
  <button className='self-center btn btn-square btn-outline' onClick={closeToast}>
    <X
      size={24}
      onClick={closeToast}
    />
  </button>
)
