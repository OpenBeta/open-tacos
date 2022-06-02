import Link from 'next/link'
import * as React from 'react'
import useResponsive from '../../js/hooks/useResponsive'
import { AreaType } from '../../js/types'
import { getSlug } from '../../js/utils'

interface SubAreaItemProps {
  subArea: AreaType
  onFocus: (id: string) => void
  selected: boolean
}

export default function SubAreaItem ({ subArea, onFocus, selected }:
SubAreaItemProps): JSX.Element {
  const { isMobile } = useResponsive()
  const styling = selected ? 'bg-gray-100' : ''

  const focus = (): void => { onFocus(subArea.id) }

  if (isMobile) {
    return (
      <SubAreaItemMobile
        subArea={subArea}
        onFocus={focus}
        selected={selected}
      />
    )
  }

  return (
    <Link href={getSlug(subArea.metadata.areaId, subArea.metadata.leaf)}>
      <div
        onClick={focus}
        onMouseEnter={focus}
        title={subArea.content?.description}
        className={`px-6 p-3 border-b hover:bg-slate-200 
      cursor-pointer transition-all ${styling}`}
        id={subArea.id}
      >
        <div className='flex flex-wrap items-baseline'>
          <h4 className='w-full flex-1 text-lg font-semibold whitespace-nowrap truncate'>
            {subArea.areaName}
          </h4>
          <div className=''>
            {subArea.totalClimbs !== 0 ? subArea.totalClimbs : 'No'} Climbs <span className='hidden sm:inline'>in Area</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

/** Progressive disclosure seems more appropriate (if not necessary) on smaller displays */
function SubAreaItemMobile ({ subArea, onFocus, selected }:
SubAreaItemProps): JSX.Element {
  const styling = selected ? 'bg-gray-200 border border-slate-400 rounded-xl my-4' : ''

  const preFlight = (event: React.SyntheticEvent): void => {
    let target: HTMLElement = event.target as HTMLElement
    // Warning. this kind of thing can be dangerous. Any while loop
    // can hang a page if misused.
    while (target.id !== subArea.id) {
      target = target.parentElement as HTMLElement
      if (target.id === 'clickInterrupt') {
        return
      }
    }

    onFocus(subArea.id)
  }

  return (
    <div
      onClick={preFlight}
      title={subArea.content?.description}
      className={`px-6 p-3 border-b hover:bg-slate-200 
      cursor-pointer transition-all ${styling}`}
      id={subArea.id}
    >
      <div className={`${selected ? '' : 'flex'} flex-wrap items-baseline`}>
        <h4 className={`w-full flex-1 text-lg font-semibold ${selected ? '' : 'whitespace-nowrap truncate'}`}>
          {subArea.areaName}
        </h4>
        <div className=''>
          {subArea.totalClimbs !== 0 ? subArea.totalClimbs : 'No'} Climbs <span className='hidden sm:inline'>in Area</span>
        </div>

      </div>
      <div
        id='clickInterrupt'
        className='w-full overflow-hidden flex justify-center'
        style={{
          transition: 'max-height 0.3s ease-in-out',
          maxHeight: selected ? '50px' : '0px'
        }}
      >
        <Link
          href={getSlug(subArea.metadata.areaId, subArea.metadata.leaf)}
          passHref
        >
          <button
            className='text-center p-2 px-6 hover:font-bold'
          >
            Visit Area
          </button>
        </Link>
      </div>
    </div>
  )
}
