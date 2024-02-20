import { useCallback, useEffect } from 'react'
import { RouteInfo, clearProject, drawTopo, initPaper, zoomViaWheel } from './paperFunctions'

interface TopoProps {
  activeRoute: RouteInfo | undefined
  image: any
  isEditor: boolean
}

export const Topo: React.FC<TopoProps> = ({ activeRoute, image, isEditor }) => {
  const canvasCallback = useCallback((node: HTMLCanvasElement) => {
    node.addEventListener('wheel', (e: WheelEvent) => { zoomViaWheel(e) }, { passive: false })
    initPaper(node, isEditor)
    drawTopo(image)
  }, [])

  useEffect(() => {
    clearProject()
    drawTopo(image)
  }, [image])

  return (
    <canvas className='w-full h-screen-80 border-solid border-2 border-gray-300 rounded' ref={canvasCallback} onKeyUp={e => console.log(e)} />
  )
}
