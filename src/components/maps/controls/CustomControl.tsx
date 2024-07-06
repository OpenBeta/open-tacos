import React, { useState, cloneElement } from 'react'
import { createPortal } from 'react-dom'
import { IControl, useControl, ControlPosition } from 'react-map-gl/maplibre'
import { Map as MaplibreMap } from 'maplibre-gl'

/**
 * Based on template in https://docs.mapbox.com/mapbox-gl-js/api/markers/#icontrol
 * Adapted from https://github.com/visgl/react-map-gl/blob/master/examples/custom-overlay/src/custom-overlay.tsx
 */
class OverlayControl implements IControl {
  _map: MaplibreMap | null = null
  _container: HTMLElement | null = null
  _position: ControlPosition

  constructor (position: ControlPosition) {
    this._position = position
  }

  onAdd (map: MaplibreMap): HTMLElement {
    this._map = map
    this._container = document.createElement('div')
    this._container.classList.add('maplibregl-ctrl', 'maplibregl-ctrl-group')
    return this._container
  }

  onRemove (): void {
    this._container?.remove()
    if (this._map == null) return
    this._map = null
  }

  getMap (): MaplibreMap | null {
    return this._map
  }

  getElement (): HTMLElement | null {
    return this._container
  }

  getDefaultPosition (): ControlPosition {
    return this._position
  }
}

/**
 * A custom control that renders React element
 * Adapted from https://github.com/visgl/react-map-gl/blob/master/examples/custom-overlay/src/custom-overlay.tsx
 */
function CustomOverlay (props: { position: ControlPosition, children: React.ReactElement }): JSX.Element | null {
  const [, setIsAdded] = useState(false)

  const ctrl = useControl<OverlayControl>(
    () => new OverlayControl(props.position),
    () => setIsAdded(true),
    () => {}
  )

  const map = ctrl.getMap()
  const element = ctrl.getElement()

  if (map == null || element == null) {
    return null
  }

  return createPortal(cloneElement(props.children, { map }), element)
}
export default React.memo(CustomOverlay)
