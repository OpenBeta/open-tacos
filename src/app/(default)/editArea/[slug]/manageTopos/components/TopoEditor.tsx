'use client'
import { AreaType, ClimbType } from '@/js/types'
import { TopoClimbListSection } from './TopoClimbListSection'
import { useEffect, useState } from 'react'
import testImage1 from './topo2.jpg'
import testImage2 from './topo3.jpg'
import testImage3 from './topo.jpg'
import { Topo } from '@/app/(default)/components/Topo/Topo'
import { ArrowCounterClockwise, ArrowUp, Check, Circle, NumberCircleZero, Pencil } from '@phosphor-icons/react'
import { ANCHOR, ARROW, RouteInfo, resetRouteTopo, setTerminationStyle, toggleDrawing, setActiveRoute, removeLastPoint, scaleTopo, BELAY } from '@/app/(default)/components/Topo/paperFunctions'
import clx from 'classnames'
import * as Slider from '@radix-ui/react-slider'

export const TopoEditor: React.FC<{ area: AreaType }> = ({ area }) => {
  const [activeRoute, setActiveRouteState] = useState<RouteInfo | undefined>()
  const [activeTopoImage, setActiveTopoImage] = useState(testImage2)
  const [termination, setTerminationState] = useState(ANCHOR)
  const [drawingState, setDrawingState] = useState(false)
  const [scaleState, setScaleState] = useState(1)

  const handleClimbClick = (climb: ClimbType, index: number): void => {
    const activeRouteInfo: RouteInfo = ({ id: climb.id, routeNumber: index, routeName: climb.name })
    if (drawingState) setDrawingState(false)
    setActiveRouteState(activeRouteInfo)
  }

  const handleScaleValueChange = (value: number[]): void => {
    setScaleState(value[0])
  }

  useEffect(() => {
    scaleTopo(scaleState)
  }, [scaleState])

  useEffect(() => {
    setTerminationStyle(termination)
  }, [termination])

  useEffect(() => {
    toggleDrawing(drawingState)
  }, [drawingState])

  useEffect(() => {
    if (activeRoute != null) {
      if (!setActiveRoute(activeRoute)) setDrawingState(true)
      scaleTopo(scaleState)
      setTerminationStyle(termination)
    }
  }, [activeRoute])

  return (
    <div
      className='' tabIndex={-1} onKeyUp={(e) => {
        e.key === 'Enter' && setDrawingState(!drawingState)
        e.key === 'Escape' && removeLastPoint()
      }} onDoubleClick={(e) => drawingState && setDrawingState(false)}
    >
      <div className='mb-4 bg-amber-100 border-solid border-2 border-amber-200 rounded p-4 inline-block'>
        <div className='mb-2 font-extrabold'>THIS IS A WORK IN PROGRESS / TEST - Currently only the 3 sample images are avaible reguardless of the area. Additionaly topos will not be saved. We are working to have this fully functioning soon, join us on <a className='underline' href='https://discord.com/channels/815145484003967026/1195881108093538446'>Discord</a> to see progress and/or report bugs</div>
        <div className='mb-2 font-bold'><span>Topo Drawing Instructions</span></div>
        <div className='mb-2'><p>#1 - Choose a base photo below</p></div>
        <div className='mb-2'><p>#2 - Choose a route to the left to start drawing. For routes with shared starts click on the route with which the start is shared where they diverge. To finish the route on another click on the other route where the routes join. To toggle a dashed style on a topo line (indicating the route is not visible) click on the section while drawing is not active.</p></div>
        <div className='mb-2'><span className=' font-bold '>Keyboard Shortcuts | </span><span>ENTER - Finish drawing, ESC - Remove last point</span></div>
        <div className=''><span className=' font-bold '>Mouse Shortcuts | </span><span>Mouse Wheel - Zoom in/out, Click + Drag + CTRL - Pan image (only when zoomed in), Double Click - Finish route</span></div>
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
            <div className={clx('btn bg-gray-200', (activeRoute != null) ? '' : 'btn-disabled')} onClick={resetRouteTopo}><ArrowCounterClockwise size={16} />Reset</div>
            <div className='border-r-[1px] h-5 border-solid border-gray-400' />
            <div className='text-sm'>Termination Style</div>
            <div className={clx('btn  bg-gray-200', termination === ANCHOR && (activeRoute != null) ? '!btn-accent' : '', (activeRoute != null) ? '' : 'btn-disabled')} onClick={() => { setTerminationState(ANCHOR) }}>
              <Circle size={16} />
            </div>
            <div className={clx('btn  bg-gray-200', termination === BELAY && (activeRoute != null) ? '!btn-accent' : '', (activeRoute != null) ? '' : 'btn-disabled')} onClick={() => { setTerminationState(BELAY) }}>
              <NumberCircleZero size={16} />
            </div>
            <div className={clx('btn  bg-gray-200', termination === ARROW && (activeRoute != null) ? '!btn-accent' : '', (activeRoute != null) ? '' : 'btn-disabled')} onClick={() => { setTerminationState(ARROW) }}>
              <ArrowUp size={16} />
            </div>
            <div className='border-r-[1px] h-5 border-solid border-gray-400' />
            <div className='text-sm'>Scale</div>
            <ScaleSlider handleScaleValueChange={handleScaleValueChange} enabled={(activeRoute != null)} />
          </div>
          <Topo activeRoute={activeRoute} image={activeTopoImage} isEditor />
        </div>
      </div>
    </div>
  )
}

const ScaleSlider: React.FC<{ handleScaleValueChange: (arg: number[]) => void, enabled: boolean }> = ({ handleScaleValueChange, enabled }) => (
  <form>
    <Slider.Root
      disabled={!enabled}
      className='relative flex items-center select-none touch-none w-[200px] h-5'
      defaultValue={[1]}
      min={0.5}
      max={1.5}
      step={0.25}
      onValueChange={(value) => handleScaleValueChange(value)}
    >
      <Slider.Track className={clx('relative grow rounded-full h-[3px]', enabled ? 'bg-gray-400' : 'bg-gray-300')}>
        <Slider.Range className={clx('absolute rounded-full h-full', enabled ? 'bg-ob-primary' : 'bg-gray-300')} />
      </Slider.Track>
      <Slider.Thumb
        className={clx('block w-5 h-5 shadow-[0_0_0_3px] shadow-shadow rounded-[10px]  focus:outline-none  focus:shadow-shadow', enabled ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-200')}
        aria-label='Volume'
      />
    </Slider.Root>
  </form>
)
