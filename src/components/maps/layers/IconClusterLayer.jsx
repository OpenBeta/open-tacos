import { CompositeLayer } from '@deck.gl/core'
import { IconLayer } from '@deck.gl/layers'
import Supercluster from 'supercluster'

function getIconSize (size) {
  return Math.min(1000, size) / 250 + 4
}

const JITTER_FACTOR = 0.002
export default class IconClusterLayer extends CompositeLayer {
  constructor (props) { // eslint-disable-line
    super(props)
  }

  shouldUpdateState ({ changeFlags }) {
    return changeFlags.somethingChanged
  }

  updateState ({ props, oldProps, changeFlags }) {
    const rebuildIndex = changeFlags.dataChanged || props.sizeScale !== oldProps.sizeScale

    if (rebuildIndex) {
      const index = new Supercluster({
        maxZoom: 16,
        radius: props.sizeScale * Math.sqrt(2),
        reduce: props.reduce,
        map: props.map
      })

      index.load(
        props.data.map(d => ({
          geometry: {
            coordinates: [
              d.metadata.lng + Math.random() * JITTER_FACTOR - JITTER_FACTOR / 2,
              d.metadata.lat + Math.random() * JITTER_FACTOR - JITTER_FACTOR / 2
            ]
          },
          properties: d
        }))
      )
      this.setState({ index })
    }

    const z = Math.floor(this.context.viewport.zoom)
    if (rebuildIndex || z !== this.state.z) {
      this.setState({
        data: this.state.index.getClusters([-180, -85, 180, 85], z),
        z
      })
    }
  }

  getPickingInfo ({ info, mode }) {
    const pickedObject = info.object && info.object.properties
    if (pickedObject) {
      if (pickedObject.cluster && mode !== 'hover') {
        info.objects = this.state.index
          .getLeaves(pickedObject.cluster_id, 25)
          .map(f => f.properties)
      }
      info.object = pickedObject
    }
    return info
  }

  renderLayers () {
    const { data } = this.state
    const { sizeScale, getIcon, ...props } = this.props

    return new IconLayer(
      this.getSubLayerProps({
        id: 'icon',
        data,
        sizeScale,
        getPosition: (d) => d.geometry.coordinates,
        getIcon,
        getSize: d => getIconSize(d.properties.sum || 1),
        updateTriggers: {
          getIcon: this.props.updateTriggers.getIcon
        },
        ...props
      })
    )
  }
}
