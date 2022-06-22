import React from 'react'
import { Switch } from '@headlessui/react'
import classNames from 'classnames'

interface ToggleProps {
  label: string | JSX.Element
  onClick: () => void
  disabled?: boolean
  checked: boolean
  justifyClass?: string
}

export default function Toggle ({ label, onClick, disabled = false, checked, justifyClass = Toggle.JUSTIFY_DEFAULT }: ToggleProps): JSX.Element {
  return (
    <Switch.Group>
      <div className={
        classNames(
          'flex items-center py-2',
          justifyClass,
          disabled ? 'pointer-events-none' : '')
        }
      >
        <Switch.Label className='mr-4'>{label}</Switch.Label>
        <Switch
          checked={checked}
          onChange={onClick}
          className={
            classNames(
              checked ? 'bg-ob-secondary brightness-110' : 'bg-gray-100 shadow-inner border border-gray-800',
              'relative inline-flex items-center h-6 rounded-full w-12',
              disabled ? (checked ? 'bg-opacity-80' : 'border-gray-100') : '')
          }
        >
          <span
            className={
              classNames(
                checked ? 'translate-x-6' : '-translate-x-0.5',
                'inline-block w-6 h-6 transform transition bg-white rounded-full border border-gray-800',
                disabled ? 'border-gray-100' : ' border-2')
            }
          />
        </Switch>
      </div>
    </Switch.Group>
  )
}

Toggle.JUSTIFY_DEFAULT = 'justify-between'
