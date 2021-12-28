import React from 'react'

import ReactPlaceholder from 'react-placeholder'

import { TextBlock } from 'react-placeholder/lib/placeholders'

import HorizontalMore from '../assets/icons/hmore.svg'

const ChangeHistory = ({ commits, loading }) => {
  return (
    <div className='flex flex-col border border-gray-300 rounded-md w-full divide-y'>
      <ReactPlaceholder
        ready={!loading}
        customPlaceholder={<MyCustomPlaceholder />}
      >
        {commits.map((row, index) => (
          <Row key={row.sha} row={row} rowIndex={index + 1} />
        ))}
      </ReactPlaceholder>
    </div>
  )
}

const Row = ({ row, rowIndex }) => {
  const { sha, html_url, name, date, age, message } = row
  return (
    <div
      key={sha}
      className='flex flex-row justify-between gap-x-4 px-4 py-8 md:py-4 hover:bg-gray-100'
    >
      <div className='flex-none pt-0.5 text-gray-500'>{rowIndex}</div>
      <div className='flex-grow'>
        <div className='font-semibold text-lg md:max-w-prose'>
          <a
            href={html_url}
            className='hover:underline hover:text-custom-secondary'
            target='_blank'
            rel='noreferrer noopener'
          >
            {message}
          </a>
        </div>
        <div className='text-sm text-gray-500'>
          {age} by {name}
        </div>
      </div>
      <div className='hidden lg:flex-none lg:inline'>
        <a href={html_url} target='_blank' rel='noreferrer noopener'>
          <HorizontalMore className='w-6 h-6 text-custom-secondary' />
        </a>
      </div>
    </div>
  )
}

const MyCustomPlaceholder = (props) => (
  <>
    <div className=' px-4 py-8 md:py-4'>
      <TextBlock rows={2} width={40} color='#F5F5F5' />
    </div>
    <div className='  px-4 py-8'>
      <TextBlock rows={2} width={40} color='#F5F5F5' />
    </div>
    <div className='  px-4 py-8'>
      <TextBlock rows={2} width={40} color='#F5F5F5' />
    </div>
  </>
)

export default ChangeHistory
