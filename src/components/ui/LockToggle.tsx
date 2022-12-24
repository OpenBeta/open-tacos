import { useState, Dispatch, SetStateAction, useEffect } from 'react'
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid'
import * as Toggle from '@radix-ui/react-toggle'

interface Props {
  name: string
  onChange: Dispatch<SetStateAction<boolean>>
}

export default function LockToggle ({ name, onChange }: Props): JSX.Element {
  const [editable, setEditable] = useState(false)

  useEffect(() => {
    const val = sessionStorage.getItem(`toggle-${name}`) === 'true'
    console.log('#Useeffect', val)
    setEditable(val)
    if (val) onChange(true)
  }, [])
  const onPressed = (): void => {
    onChange(!editable)
    setEditable(curr => {
      sessionStorage.setItem(`toggle-${name}`, (!curr).toString())
      return !curr
    })
  }

  return (
    <Toggle.Root className='Toggle btn btn-sm btn-ghost' aria-label='Toggle italic' pressed={editable} onPressedChange={onPressed}>
      {editable ? <><LockOpenIcon className='w-5 h-5' /> <span className='ml-1.5 mt-1 text-xs font-light'>Edit mode</span></> : <><LockClosedIcon className='w-5 h-5' /> <span className='mt-1 ml-1.5 text-xs font-light'>Unlock to edit</span></>}
    </Toggle.Root>
  )
}
