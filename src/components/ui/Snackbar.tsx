import { useState, useEffect } from 'react'

interface SnackbarProps {
  message: string
  open: boolean
  onClose: () => void
}
export default function Snackbar ({ open, message, onClose }: SnackbarProps): JSX.Element | null {
  const [show, setShow] = useState(open)

  useEffect(() => {
    setShow(open)
    const timeId = setTimeout(() => {
      // After 3 seconds set the show value to false
      setShow(false)
      onClose()
    }, 3000)

    return () => {
      clearTimeout(timeId)
    }
  }, [open])

  return (
    <span className='h-8 flex items-center text-pink-500 text-sm'>
      {show && message}
    </span>
  )
}
