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
    <div className='hidden lg:fixed top-0 left-0 w-screen lg:horizontal-center pointer-events-none'>
      <div id='searchPanel' className='mt-1 horizontal-center w-full px-8'>
        <FakeSearchBox onClick={onClick} expanded={expanded} />
        {/* {expanded && <div className='hidden md:block py-4 text-secondary-contrast pointer-events-auto'>Find climbs by name, style or FA</div>} */}
        <div className={`pointer-events-auto opacity-100 ${expanded ? 'w-full' : 'hidden'}`}>
          <Tabs
            labels={['Places to climb', 'Climb search']}
            panelCompList={[
              <CragFinder key={2} isMobile={false} />,
              <ClimbSearchByName key={1} isMobile={false} />
              // (<div className='w-full bg-white rounded-full h-12 flex flex-col items-center justify-center' key={2}><div>🌱🌱🌱 Coming soon 🌱🌱🌱</div></div>)
            ]}
          />
        </div>
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
