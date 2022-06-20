import React, { useEffect } from 'react'
import { Transition } from '@headlessui/react'

import Tabs from './Tabs'
import { SearchIcon } from '@heroicons/react/outline'
import { ClimbSearchByName } from './ClimbSearchByName'
import CragFinder from './CragFinder'

interface ClimbSearchProps {
  expanded: boolean
  onClick: any
  onClickOutside: any
}

const ClimbSearch = ({ expanded, onClick, onClickOutside }: ClimbSearchProps): JSX.Element => {
  useEffect(() => {
    document.addEventListener('click', outsideClickDetector)
    return () => { document.removeEventListener('click', outsideClickDetector) }
  }, [])

  const outsideClickDetector = (event: any): void => {
    const searchDiv = document.getElementById('searchPanel')
    if (searchDiv === null) return
    const withinBoundaries: boolean = event.composedPath().includes(searchDiv)

    if (!withinBoundaries) {
      onClickOutside()
    }
  }

  return (
    <div id='searchPanel' className='z-50 absolute top-0 left-0 mx-auto w-full  horizontal-center pointer-events-none'>
      <Transition
        className='h-16 flex items-center pointer-events-none'
        show={!expanded}
        enter='transition-opacity duration-300'
        enterFrom='opacity-0'
        enterTo='opacity-100'
      >
        <FakeSearchBox onClick={onClick} expanded={expanded} />
      </Transition>
      <Transition
        className='mt-6 pointer-events-none max-w-screen-sm mx-auto'
        show={expanded}
        enter='transition-opacity duration-150'
        enterFrom='opacity-0'
        enterTo='opacity-100'
      >
        <Tabs
          labels={['Places to climb', 'Climb search']}
          panelCompList={[
            <div key={2} className='pb-2 bg-slate-800'>
              <div className='max-w-screen-sm mx-auto px-16'>
                <CragFinder isMobile={false} />
              </div>
            </div>,
            <div key={1} className='pb-2 bg-slate-800'>
              <div className='max-w-screen-sm mx-auto px-16'>
                <ClimbSearchByName isMobile={false} />
              </div>
            </div>
          ]}
        />
      </Transition>
    </div>
  )
}

export const FakeSearchBox = ({ placeholder = 'Start your search', onClick, expanded = false }: {placeholder?: string, onClick: any, expanded: boolean}): JSX.Element => {
  return (
    <div onClick={onClick} className='pointer-events-auto cursor-pointer border border-gray-200 shadow-lg shadow-inner rounded-lg flex flex-row justify-between items-center gap-x-4 py-1 bg-white'>
      <div className='pl-4 pr-8 text-sm'>{placeholder}</div>
      <div className='rounded-full bg-custom-primary p-2 mr-1'>
        <SearchIcon className='w-4 h-4 stroke-white' />
      </div>
    </div>
  )
}

export default ClimbSearch
