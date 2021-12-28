import React from 'react'

export default function Toggle ({ label, onClick, className }) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className='relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in'>
        <input
          type='checkbox'
          name='toggle'
          id='toggle'
          className='toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer'
          onChange={() => onClick && onClick()}
        />
        <label
          htmlFor='toggle'
          className='toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer'
        />
      </div>
      <label htmlFor='toggle' className='text-xs text-gray-700'>
        {label}
      </label>
    </div>
  )
}
