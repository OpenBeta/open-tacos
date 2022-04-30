import { useState, useCallback, memo } from 'react'
import { Popover } from '@headlessui/react'

import ClimbSearchForTagging from '../search/ClimbSearchForTagging'

export default function ImageTagger (): JSX.Element {
  const [mouseXY, setXY] = useState([0, 0])
  const clickHandler = useCallback((event) => {
    setXY([event.clientX, event.clientY])
  }, [])
  return (
    <div
      className='absolute w-full h-full top-0 left-0'
    >
      <Popover className='relative w-full h-full'>
        {({ open }) => (
          <>
            <div
              className='relative w-full h-full border-blue-200 border-2' onClick={(event) => {
                clickHandler(event)
              }}
            >
              <Popover.Button className='w-full h-full'>
                <span>&nbsp;</span>
              </Popover.Button>
            </div>
            <Popover.Overlay className='fixed w-full h-full h-screen w-screen inset-0 bg-black opacity-30' />
            <M mouseXY={mouseXY} />
          </>)}
      </Popover>
    </div>
  )
}

const PopContainer = ({ mouseXY }): JSX.Element => {
  console.log(mouseXY)
  return (
    <Popover.Panel focus className='z-20 fixed top-0 left-0 w-full'>
      <div className='absolute' style={{ left: mouseXY[0] - 12, top: mouseXY[1] - 12 }}>
        <div className='w-8 h-8 border'>&nbsp;</div>
        <div className='absolute -left-[126px]'>
          <ClimbSearchForTagging isMobile={false} placeholder='Search for climb' />
        </div>
      </div>
    </Popover.Panel>
  )
}

const M = memo(PopContainer)
