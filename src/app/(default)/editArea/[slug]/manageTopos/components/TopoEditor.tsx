'use client'
import { AreaType, ClimbType } from '@/js/types'
import { TopoClimbListSection } from './TopoClimbListSection'
import { useEffect, useState } from 'react'
import testImage1 from './topo2.jpg'
import testImage2 from './topo3.jpg'
import testImage3 from './topo.jpg'
import { Topo } from '@/app/(default)/components/Topo/Topo'
import { ArrowCounterClockwise, ArrowUp, Check, Circle, Pencil } from '@phosphor-icons/react'
import { ANCHOR, ARROW, RouteInfo, resetRouteTopo, setTerminationStyle, toggleDrawing, setActiveRoute, removeLastPoint } from '@/app/(default)/components/Topo/paperFunctions'
import clx from 'classnames'

export const TopoEditor: React.FC<{ area: AreaType }> = ({ area }) => {
  const [activeRoute, setActiveRouteState] = useState<RouteInfo | undefined>()
  const [activeTopoImage, setActiveTopoImage] = useState(testImage2)
  const [termination, setTerminationState] = useState(ANCHOR)
  const [drawingState, setDrawingState] = useState(false)

  const handleClimbClick = (climb: ClimbType, index: number): void => {
    const activeRouteInfo: RouteInfo = ({ id: climb.id, routeNumber: index, routeName: climb.name })
    if (drawingState) setDrawingState(false)
    setActiveRouteState(activeRouteInfo)
  }

  useEffect(() => {
    setTerminationStyle(termination)
  }, [termination])

  useEffect(() => {
    toggleDrawing(drawingState)
  }, [drawingState])

  useEffect(() => {
    if (activeRoute != null) {
      if (!setActiveRoute(activeRoute)) setDrawingState(true)
    }
  }, [activeRoute])

  return (
    <div
      className='' tabIndex={-1} onKeyUp={(e) => {
        e.key === 'Enter' && setDrawingState(!drawingState)
        e.key === 'Escape' && removeLastPoint()
      }}
    >
      <div className='mb-4 bg-amber-100 border-solid border-2 border-amber-200 rounded p-4 inline-block'>
        <div className='mb-2 font-bold'><span>Topo Drawing Instructions</span></div>
        <div className='mb-2'><p>#1 - Choose a base photo below</p></div>
        <div className='mb-2'><p>#2 - Choose a route to the left to start drawing. For routes with shared starts click on the route with which the start is shared where they diverge. To finish the route on another click on the other route where the routes join. To toggle a dashed style on a topo line (indicating the route is not visible) click on the section while drawing is not active.</p></div>
        <span className=' font-bold '>Keyboard Shortcuts | </span><span>ENTER - Finish drawing, ESC - Remove last point</span>
      </div>
      <div>
        <h3 className=''>Topo Images</h3>
        <hr className='mt-2 mb-6 border-2 border-base-content' />
        <div className='flex flex-row h-32 gap-4'>
          <img src={testImage1.src} alt='' className='hover:opacity-75' onClick={() => { setActiveTopoImage(testImage1); setActiveRouteState(undefined) }} />
          <img src={testImage2.src} alt='' className='hover:opacity-75' onClick={() => { setActiveTopoImage(testImage2); setActiveRouteState(undefined) }} />
          <img src={testImage3.src} alt='' className='hover:opacity-75' onClick={() => { setActiveTopoImage(testImage3); setActiveRouteState(undefined) }} />
        </div>
      </div>
      <div className='grid grid-cols-6 my-8 gap-8'>
        <TopoClimbListSection area={area} activeRoute={activeRoute} onClick={handleClimbClick} />
        <div id='topo' className='col-start-2 col-end-7'>
          <h3 className=''>Topo Editor</h3>
          <hr className='mt-2 mb-6 border-2 border-base-content' />

          <div className='flex flex-row gap-4 mb-6 items-center'>
            <div className={clx('btn bg-gray-200', drawingState ? '!btn-accent' : '', (activeRoute != null) ? '' : 'btn-disabled')} onClick={() => { setDrawingState(!drawingState) }}>{drawingState ? <Check size={16} /> : <Pencil size={16} />}{drawingState ? 'Finish (Enter)' : 'Draw'}</div>
            <div className={clx('btn bg-gray-200', (activeRoute !== null) ? '' : 'btn-disabled')} onClick={resetRouteTopo}><ArrowCounterClockwise size={16} />Reset</div>
            <div className='border-r-[1px] h-5 border-solid border-gray-400' />
            <div className='text-sm'>Termination Style</div>
            <div className={clx('btn  bg-gray-200', termination === ANCHOR && (activeRoute != null) ? '!btn-accent' : '', (activeRoute != null) ? '' : 'btn-disabled')} onClick={() => { setTerminationState(ANCHOR) }}>
              <Circle size={16} />
            </div>
            <div className={clx('btn  bg-gray-200', termination === ARROW ? '!btn-accent' : '', (activeRoute != null) ? '' : 'btn-disabled')} onClick={() => { setTerminationState(ARROW) }}>
              <ArrowUp size={16} />
            </div>
          </div>
          <Topo activeRoute={activeRoute} image={activeTopoImage} isEditor />
        </div>
      </div>
    </div>
  )
}
