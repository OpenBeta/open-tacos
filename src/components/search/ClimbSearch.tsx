import React, { useEffect } from 'react'
import Tabs from './Tabs'
import SearchIcon from '../../assets/icons/search.svg'
import { ClimbSearchByName } from './ClimbSearchByName'
import CragFinder from './CragFinder'
interface ClimbSearchProps {
  expanded: boolean
  onClick: any
  onClickOutside: any
}

const ClimbSearch = ({ expanded, onClick, onClickOutside }: ClimbSearchProps): JSX.Element => {
  useEffect(() => {
    document.addEventListener('click', outsideClickDectector)
    return () => { document.removeEventListener('click', outsideClickDectector) }
  }, [])

  const outsideClickDectector = (event: any): void => {
    const searchDiv = document.getElementById('searchPanel')
    const isClickInsideElement = searchDiv.contains(event.target as Node)
    if (!isClickInsideElement) {
      onClickOutside()
    }
  }

  return (
    <div className='hidden lg:fixed top-0 left-0 mx-auto w-full max-w-screen-2xl lg:horizontal-center pointer-events-none'>
      <div id='searchPanel' className='mt-1 horizontal-center w-full pointer-events-none'>
        <FakeSearchBox onClick={onClick} expanded={expanded} />
        {expanded && (
          <div className={`pointer-events-auto opacity-100 ${expanded ? 'w-full' : 'hidden'}`}>
            <Tabs
              labels={['Places to climb', 'Climb search']}
              panelCompList={[
                <div key={2} className='pb-4 bg-slate-800'>
                  <CragFinder isMobile={false} />
                </div>,
                <div key={1} className='pb-4 bg-slate-800'>
                  <ClimbSearchByName isMobile={false} />
                </div>
              ]}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export const FakeSearchBox = ({ placeholder = 'Start your search', onClick, expanded = false }: {placeholder?: string, onClick: any, expanded: boolean}): JSX.Element => {
  return (
    <div className='py-2 pointer-events-auto' onClick={onClick}>
      <div className={`${expanded ? 'hidden h-0' : 'block'} cursor-pointer border border-gray-200 shadow-lg shadow-inner rounded-full flex flex-row justify-between items-center gap-x-4 py-0.5 bg-white`}>
        <div className='pl-4 pr-8 text-sm'>{placeholder}</div>
        <div className='rounded-full bg-custom-primary p-2 mr-1'>
          <SearchIcon className='stroke-white' />
        </div>
      </div>
    </div>
  )
}

export default ClimbSearch
