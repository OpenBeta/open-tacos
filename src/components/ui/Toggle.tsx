import React from 'react'
import { Switch } from '@headlessui/react'

interface ToggleProps {
  label: string | JSX.Element
  onClick: () => void
  enabled: boolean
  justifyClass?: string
}

export default function Toggle ({ label, onClick, enabled, justifyClass = Toggle.JUSTIFY_DEFAULT }: ToggleProps): JSX.Element {
  return (
    <Switch.Group>
      <div className={`flex items-center ${justifyClass} py-2`}>
        <Switch.Label className='mr-4'>{label}</Switch.Label>
        <Switch
          checked={enabled}
          onChange={onClick}
          className={`${
        enabled ? 'bg-ob-secondary' : 'bg-gray-200  shadow-inner border border-gray-300'
      } relative inline-flex items-center h-6 rounded-full w-12`}
        >
          <span
            className={`${
          enabled ? 'translate-x-6' : '-translate-x-0.5'
        } inline-block w-6 h-6 transform transition bg-white rounded-full border border-gray-500`}
          />
        </Switch>
      </div>
    </Switch.Group>
  )
}

Toggle.JUSTIFY_DEFAULT = 'justify-between'
