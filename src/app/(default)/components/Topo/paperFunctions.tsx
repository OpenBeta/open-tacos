import { StaticImageData } from 'next/image'
import paper, { Path, Layer, Raster, Color, Point, Group, Size } from 'paper'
import { PaperOffset } from 'paperjs-offset'

const TOPO_VERSION = 1

const ZOOM_FACTOR = 1.1

const SavedTopoData: { [key: string]: string | undefined } = {}

// COLORS
const BLACK = new Color('black')
const WHITE = new Color('white')
const RED = new Color('red')
const BG = new Color('rgb(229, 231, 235)')

// GROUPS
let activeRouteTopo: RouteTopo | undefined
let routeTopos: RouteTopos = {}
let strokeGroup: paper.Group | undefined

// LAYERS
let imageLayer: paper.Layer | undefined
let drawingLayer: paper.Layer | undefined

// TOOLS
const drawTool = new paper.Tool()

// TOPO ELEMENT KEYS
// const ROUTE_GROUP: keyof RouteTopo = 'routeGroup'
const TOPO_PATH: keyof RouteTopo = 'topoPath'
const TOPO_NUMBER_TEXT: keyof RouteTopo = 'topoNumber'
const TOPO_NUMBER_BG: keyof RouteTopo = 'topoNumberBg'
const TOPO_STROKE_PATH = 'topoStrokePath'
const TOPO_PATH_TERMINATION: keyof RouteTopo = 'topoPathTermination'
const TOPO_DASH_PATH: keyof RouteTopo = 'topoDashPath'
const STROKE_GROUP = 'strokeGroup'

// TERMINAION STYLE KEYS
export const ARROW = 'arrow'
export const ANCHOR = 'anchor'
export const BELAY = 'belay' // TODO

let mouseDownPoint = new Point(0, 0) // Used for pan fuction

// States
// let isEditor: boolean | undefined
let currentlyDrawing: boolean = false

export interface RouteInfo {
  id: string | undefined
  routeNumber: number
  routeName: string
  // routeGrade: string,
  // routeStyle: string
}

interface RouteTopo {
  routeGroup: paper.Group
  topoPath: paper.Path
  topoNumber: paper.PointText
  topoNumberBg: paper.Path
  topoPathTermination: paper.Path
  topoDashPath: paper.CompoundPath
  sharesStartWith: string[]
  endsOn?: string
  smoothFrom?: number | null
  smoothTo?: paper.Segment
}

interface RouteTopos {
  [key: string]: RouteTopo
}

export function initPaper (canvas: HTMLCanvasElement, isEditorMode: boolean): void {
  // isEditor = isEditorMode
  if (paper.project === null) paper.setup(canvas)
  if (isEditorMode) {
    // console.log("InitPaper")
    drawTool.onMouseUp = handleMouseUp
    drawTool.onMouseMove = handleMouseMove
    // drawTool.onKeyUp = function (event: paper.KeyEvent) {
    //     if (event.key == 'space' && drawingLayer) {
    //         cleanUpTopo()
    //         download(new File([drawingLayer.exportJSON()], 'path.json', {
    //             type: 'json',
    //         }))
    //     }
    // }
  }
  paper.view.onMouseDrag = handleMouseDrag
  paper.view.onMouseDown = handleMouseDown
}

// Function draws the topo image and sets up the layer for drawing the topo data. If there is existing TOPO data it imports it and draws it
export function drawTopo (image: StaticImageData, data?: string): void {
  const rect = new Path.Rectangle({
    point: [0, 0],
    size: [paper.project.view.size.width, paper.project.view.size.height]
  })
  rect.fillColor = BG
  rect.sendToBack()
  imageLayer = new Layer({ data: image.src })
  const topoImage = new Raster({ source: image.src, position: paper.project.view.center })

  // Scale image to fit
  topoImage.height > topoImage.width ? imageLayer.scale(paper.view.bounds.height / imageLayer.bounds.height) : imageLayer.scale(paper.view.bounds.width / imageLayer.bounds.width)

  // Create layer for drawing
  drawingLayer = new Layer({ data: { topoVersion: TOPO_VERSION } })
  drawingLayer.activate()

  data = SavedTopoData[image.src]

  // Import data
  if (data != null) {
    drawingLayer.importJSON(data)
    drawingLayer.children.forEach((child) => {
      switch (child.name) {
        case STROKE_GROUP:
          strokeGroup = child as paper.Group
          break
        case undefined:
        case null:
          break
        default:
          routeTopos = {
            ...routeTopos,
            [child.name]: {
              routeGroup: child as paper.Group,
              topoPath: findChildByName(child, TOPO_PATH) as paper.Path,
              topoNumber: findChildByName(child, TOPO_NUMBER_TEXT) as paper.PointText,
              topoNumberBg: findChildByName(child, TOPO_NUMBER_BG) as paper.Path,
              topoPathTermination: findChildByName(child, TOPO_PATH_TERMINATION) as paper.Path,
              topoDashPath: findChildByName(child, TOPO_DASH_PATH) as paper.Path,
              sharesStartWith: [] // TODO - FIX THIS
            }
          }
          hookupRouteEventHandlers(child as paper.Group)

          break
      }
    })
  } else {
    strokeGroup = new Group({ name: STROKE_GROUP })
  }
}

export function setActiveRoute (routeInfo: RouteInfo): boolean {
  if (routeInfo.id === undefined) {
    console.log('ERROR : Route id undefined')
    return false
  }
  // If route doesnt exist create it
  if (findChildByName(drawingLayer, routeInfo.id) == null) {
    const routeGroup = new Group({ name: routeInfo.id, data: routeInfo })
    const routeTopo = {
      routeGroup,
      topoPath: new Path({ name: TOPO_PATH, parent: routeGroup, strokeColor: BLACK, strokeWidth: 3, strokeCap: 'butt', strokeJoin: 'round', fullySelected: false }),
      topoNumber: new paper.PointText({ name: TOPO_NUMBER_TEXT, parent: routeGroup, content: routeInfo.routeNumber, fillColor: WHITE, fontSize: 20 }),
      topoPathTermination: new Path.Circle({ name: TOPO_PATH_TERMINATION, parent: routeGroup, radius: 10, strokeWidth: 2, strokeColor: WHITE, fillColor: BLACK, visible: false }),
      topoNumberBg: new Path({ name: TOPO_NUMBER_BG, parent: routeGroup, fillColor: BLACK, strokeWidth: 2, strokeColor: WHITE }),
      topoDashPath: new paper.CompoundPath({ name: TOPO_DASH_PATH, parent: routeGroup, strokeColor: WHITE, strokeWidth: 5, dashArray: [10, 10] }),
      sharesStartWith: []
    }
    hookupRouteEventHandlers(routeGroup)
    const path = new Path({ name: routeInfo.id + TOPO_STROKE_PATH, parent: strokeGroup, strokeColor: WHITE, strokeWidth: 7, strokeCap: 'square', strokeJoin: 'round' })
    path.opacity = 1
    routeTopos = { ...routeTopos, [routeInfo.id]: routeTopo }
  }
  activeRouteTopo = routeTopos[routeInfo.id]
  return activeRouteTopo.topoPath.segments.length !== 0
}

// Toggles topo line drawing mode
export function toggleDrawing (state: boolean): void {
  if (activeRouteTopo == null) return
  currentlyDrawing = state
  if (state) {
    activeRouteTopo.topoPathTermination.visible = false
  } else {
    activeRouteTopo.topoPath.lastSegment?.remove()
    drawPathLook(activeRouteTopo)
  }
}

// Resets topo line to undrawn state
export function resetRouteTopo (): void {
  if (activeRouteTopo == null) return
  const routeInfo = activeRouteTopo.routeGroup.data
  activeRouteTopo.routeGroup.remove()
  findChildByName(strokeGroup, activeRouteTopo.routeGroup.name + TOPO_STROKE_PATH)?.remove()
  setActiveRoute(routeInfo)
}

export function removeLastPoint (): void {
  if (activeRouteTopo != null) {
    activeRouteTopo.topoPath.lastSegment?.remove()
    drawPathLook(activeRouteTopo)
  }
}

export function setTerminationStyle (terminationType: string): void {
  if (activeRouteTopo?.topoPath.lastSegment != null) drawTermination(activeRouteTopo, terminationType)
}

// Saves state and removes all data from paper project in order to draw new topo
export function clearProject (): void {
  cleanUpTopo()
  SavedTopoData[imageLayer?.data] = drawingLayer?.exportJSON()
  paper.project.clear()
}

export function highlightRoute (id: string): void {
  id in routeTopos && setTopoPathColor(id, RED)
}

export function unHighlightRoute (id: string): void {
  id in routeTopos && setTopoPathColor(id, BLACK)
}

function hookupRouteEventHandlers (routeGroup: paper.Group): void {
  // routeGroup.onMouseEnter = (e: paper.MouseEvent) => {
  //     if (e.currentTarget.name && !currentlyDrawing && !(activeRouteTopo?.routeGroup.name === e.currentTarget.name)) {
  //         e.currentTarget.bringToFront()
  //         document.getElementById(e.currentTarget.name)?.classList.add('!bg-red-200')
  //         setTopoPathColor(e.currentTarget.name, RED)
  //     }
  // }

  // routeGroup.onMouseLeave = (e: paper.MouseEvent) => {
  //     if (e.currentTarget.name && !currentlyDrawing && !(activeRouteTopo?.routeGroup.name === e.currentTarget.name)) {
  //         document.getElementById(e.currentTarget.name)?.classList.remove('!bg-red-200')
  //         setTopoPathColor(e.currentTarget.name, BLACK)
  //     }
  // }

}

// Start route from an existing topo line
function startRouteFrom (e: paper.ToolEvent): void {
  if (e.item instanceof Group && e.item.name != null && activeRouteTopo != null) {
    const upstreamRoute = routeTopos[e.item.name]
    const upstreamPath = upstreamRoute.topoPath.clone()
    const routeSharesWith: RouteTopo[] = [upstreamRoute]
    const routeNumber: number[] = [upstreamRoute.routeGroup.data.routeNumber]
    // Copy route path and split a click
    upstreamPath.splitAt(upstreamPath.getNearestLocation(e.point)).remove()
    // Put path data on active route
    activeRouteTopo.topoPath.pathData = upstreamPath.pathData
    // No more smoothing below the divergence point
    activeRouteTopo.smoothFrom = activeRouteTopo.topoPath.lastSegment.index
    activeRouteTopo.topoPath.add(e.point)

    upstreamRoute.sharesStartWith.forEach((name) => {
      const route = routeTopos[name]
      routeNumber.push(route.routeGroup.data.routeNumber)
      routeSharesWith.push(route)
      if (activeRouteTopo != null) {
        route.sharesStartWith = [...route.sharesStartWith, activeRouteTopo.routeGroup.name]
        activeRouteTopo.sharesStartWith = [...activeRouteTopo.sharesStartWith, route.routeGroup.name]
      }
    })

    upstreamRoute.sharesStartWith = [...upstreamRoute.sharesStartWith, activeRouteTopo.routeGroup.name]
    activeRouteTopo.sharesStartWith = [...activeRouteTopo.sharesStartWith, upstreamRoute.routeGroup.name]
    // Update route number
    routeNumber.push(activeRouteTopo.routeGroup.data.routeNumber)
    routeNumber.sort(function (a, b) {
      return a - b
    })
    const newStartNumber = routeNumber.toString()
    routeSharesWith.forEach((routeTopo) => {
      routeTopo.topoNumber.content = newStartNumber
      drawPathLook(routeTopo, true)
    })

    activeRouteTopo.topoNumber.content = newStartNumber
  }
}

// Join topo to existing one
function joinWithRoute (e: paper.ToolEvent): void {
  if (activeRouteTopo == null) return
  const downstreamRoute = routeTopos[e.item.name]
  const path = downstreamRoute.topoPath.clone()
  const endingPath = path.splitAt(path.getNearestLocation(e.point))
  activeRouteTopo.topoPath.lastSegment.remove()
  activeRouteTopo.smoothTo = activeRouteTopo.topoPath.lastSegment
  activeRouteTopo.topoPath.addSegments(endingPath.segments)
  activeRouteTopo.topoPathTermination.data.type = downstreamRoute.topoPathTermination.data.type
  path.remove()
  endingPath.remove()
  drawPathLook(activeRouteTopo)
  activeRouteTopo = undefined
}

// Draws/upates the outter stroke on topo lines as well as the topo nunmber
function drawPathLook (routeTopo: RouteTopo, updateNumber?: boolean): void {
  const { topoPath, topoNumberBg, topoNumber, topoPathTermination } = routeTopo
  const topoStrokePath = findChildByName(strokeGroup, routeTopo.routeGroup.name + TOPO_STROKE_PATH) as paper.Path

  // Diplicate path for white stroke
  topoStrokePath.pathData = topoPath.pathData

  if (topoPath.segments.length === 0) return

  // Get origin point of line
  const topoLineOrigin = topoPath.segments[0]

  // Place number and BG on line origin
  topoNumber.position = topoLineOrigin.point
  topoNumberBg.position = topoLineOrigin.point
  if (topoNumberBg.segments.length === 0 || updateNumber === true) topoNumberBg.pathData = new Path.Rectangle(topoNumber.bounds.expand(10), new Size(5, 5)).pathData

  !currentlyDrawing && drawTermination(routeTopo, topoPathTermination.data.type)

  // Z-Order
  topoPathTermination.bringToFront()
  topoNumberBg.bringToFront()
  topoPath.bringToFront()
  topoNumber.bringToFront()
}

// Sets primary path color for a topo line
function setTopoPathColor (id: String, color: paper.Color): void {
  const routeGroup = drawingLayer?.getItem({ name: id })
  findChildByName(routeGroup, TOPO_PATH)?.set({ strokeColor: color })
  findChildByName(routeGroup, TOPO_NUMBER_BG)?.set({ fillColor: color })
  findChildByName(routeGroup, TOPO_PATH_TERMINATION)?.set({ fillColor: color })
  routeGroup?.bringToFront()
}

// Draws the termination of the topoline. Default is an anchor circle
function drawTermination (activeRouteTopo: RouteTopo, type?: string): void {
  const termination = activeRouteTopo.topoPathTermination
  if (type === ARROW) {
    const drawOn = activeRouteTopo.topoPath.getPointAt(activeRouteTopo.topoPath.length - 5)
    const arrow = new Path([new Point(0, 0), new Point(15, 10), new Point(0, 20)])
    const expandedArrow = PaperOffset.offsetStroke(arrow, 2.5, { cap: 'round', join: 'round' })
    termination.pathData = expandedArrow.pathData
    termination.position = drawOn
    termination.rotation = activeRouteTopo.topoPath.lastSegment.handleIn.angle + 180
    termination.data = { type: ARROW }
    arrow.remove()
  } else {
    const drawOn = activeRouteTopo.topoPath.lastSegment.point
    const circle = new Path.Circle(drawOn, 10)
    termination.pathData = circle.pathData
    termination.data = { type: ANCHOR }
    circle.remove()
  }
  termination.insertBelow(activeRouteTopo.topoPath)
  termination.visible = true
}

// EVENT HANDLERS

// Handler for zoom via mousewheel
export function zoomViaWheel (e: WheelEvent): void {
  const view = paper.view
  const { clientX, clientY, currentTarget } = e
  const { offsetLeft, offsetTop, width, height } = currentTarget as HTMLCanvasElement
  const delta = -e.deltaY
  const newZoom = delta > 0 ? 1 * ZOOM_FACTOR : 1 / ZOOM_FACTOR
  if ((view.zoom < 1.1 && newZoom < 1) || view.zoom * newZoom > 4) {
    e.preventDefault()
    return
  }
  const center = view.viewToProject(new paper.Point(clientX - offsetLeft, clientY - offsetTop))
  view.scale(newZoom, center)
  // Dont zoom out of image bounds
  const offset = new Point(0, 0)
  if (view.bounds.x + view.bounds.width > width) offset.x = width - view.bounds.x - view.bounds.width
  if (view.bounds.x < 0) offset.x = -view.bounds.x
  if (view.bounds.y + view.bounds.height > height) offset.y = height - view.bounds.y - view.bounds.height
  if (view.bounds.y < 0) offset.y = -view.bounds.y
  paper.view.center = paper.view.center.add(offset)
  e.preventDefault()
}

// Handler for drawing line from last point to mouse position when drawing
const handleMouseMove = (e: paper.ToolEvent): void => {
  if ((activeRouteTopo != null) && currentlyDrawing && activeRouteTopo.topoPath.segments.length >= 1) {
    if (activeRouteTopo.topoPath.segments.length > 1) activeRouteTopo.topoPath.lastSegment.remove()
    activeRouteTopo.topoPath.add(e.point)
    activeRouteTopo.topoPath.smooth({ type: 'catmull-rom', factor: 0, from: activeRouteTopo.smoothFrom !== null ? activeRouteTopo.smoothFrom : 0, to: -1 })
    drawPathLook(activeRouteTopo)
    activeRouteTopo.routeGroup.sendToBack()
    strokeGroup?.sendToBack()
  }
}

// Handler for adding a line point on click when drawing
const handleMouseUp = (e: paper.ToolEvent): void => {
  if (e.modifiers.control === true) return
  if (currentlyDrawing && e.item.name in routeTopos && activeRouteTopo?.topoPath.segments.length === 0) {
    startRouteFrom(e)
    return
  }
  if (currentlyDrawing && e.item.name in routeTopos && e.item.name !== activeRouteTopo?.routeGroup.name) {
    joinWithRoute(e)
    return
  }
  if ((activeRouteTopo != null) && currentlyDrawing) {
    activeRouteTopo.topoPath.add(e.point)
  }
  if (!currentlyDrawing && e.item.name in routeTopos) {
    const hit = paper.project.hitTest(e.point)
    if (hit !== null) {
      const routeGroup = routeTopos[e.item.name]
      const { topoDashPath, topoPathTermination, topoNumberBg, topoPath } = routeGroup
      const curve = hit.location.curve

      // Check if the path already exisit - delete it if so
      if (topoDashPath.isChild(hit.item)) {
        hit.item.remove()
        return
      }

      const segment1 = new paper.Segment(curve.point1, undefined, curve.points[1].subtract(curve.point1))
      const segment2 = new paper.Segment(curve.point2, curve.points[2].subtract(curve.point2))
      let selection = new Path.Line({
        segments: [segment1, segment2],
        name: e.item.name + 'DashSegment',
        strokeWidth: 6,
        strokeColor: RED
      })

      if (selection.intersects(topoPathTermination)) selection.splitAt(selection.getIntersections(topoPathTermination)[0]).remove()
      if (selection.intersects(topoNumberBg)) {
        const newSelection = selection.splitAt(selection.getIntersections(topoNumberBg)[0])
        selection.remove()
        selection = newSelection
      }
      topoDashPath.addChild(selection)
      topoDashPath.insertAbove(topoPath)
    }
  }
}

// Handler for panning
const handleMouseDrag = (e: paper.MouseEvent): void => {
  if (e.modifiers.control === true) {
    const offset = mouseDownPoint.subtract(e.point)
    const bounds = paper.view.bounds
    const { width, height } = paper.view.element
    // Dont pan out of image bounds
    if (!(bounds.x + offset.x + bounds.width < width && bounds.x + offset.x > 0)) offset.x = 0
    if (!(bounds.y + offset.y + bounds.height < height && bounds.y + offset.y > 0)) offset.y = 0

    paper.view.center = paper.view.center.add(offset)
  }
}

// Handler to record where click and drag started. Used for pan functionality
const handleMouseDown = (e: paper.MouseEvent): void => {
  mouseDownPoint = e.point
}

// UTILITY FUNCTIONS

function findChildByName (item: paper.Item | undefined, name: string): paper.Path | paper.PointText | paper.CompoundPath | paper.Group | undefined {
  if (item != null) {
    const child = item.children.find((item) => item.name === name)
    switch (name) {
      case TOPO_PATH:
      case TOPO_NUMBER_BG:
      case TOPO_STROKE_PATH:
      case TOPO_PATH_TERMINATION:
        return child as paper.Path
      case TOPO_NUMBER_TEXT:
        return child as paper.PointText
      case TOPO_DASH_PATH:
        return child as paper.CompoundPath
      default:
        return child as paper.Group
    }
    // return item.children.find((item) => item.name === name) as paper.Path | paper.PointText | paper.CompoundPath | paper.Group | undefined
  }
}

// Removes any extra items from the drawing.
function cleanUpTopo (): void {
  if (drawingLayer == null) return
  for (const child of drawingLayer.children) {
    if (child.name === null) child.remove()
  }
}

// function download(file: File) {
//     const link = document.createElement('a')
//     const url = URL.createObjectURL(file)

//     link.href = url
//     link.download = file.name
//     document.body.appendChild(link)
//     link.click()

//     document.body.removeChild(link)
//     window.URL.revokeObjectURL(url)
// }
