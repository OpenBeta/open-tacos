'use client'
import { useRef, useState } from 'react'
import { Map, NavigationControl, FullscreenControl, MapRef, GeoJSONSource, LngLat, Marker } from 'react-map-gl/maplibre'
import { point, featureCollection } from '@turf/helpers'
import bboxFn from '@turf/bbox'
import { BBox2d, Point, Feature } from '@turf/helpers/dist/js/lib/geojson'

import { ChangesetType, ClimbType, AreaType } from '@/js/types'
import { MAP_STYLES } from '@/components/maps/MapSelector'
import { RecentEditsLayer, clusterLayer, UnclusteredSource, labelLayer } from './MapboxLayers'
import { ChangesetCard } from '@/components/edit/RecentChangeHistory'

type MetadataWithLatLng = ClimbType | AreaType

interface FEATURE_PROPS { historyIndex: number, name: string}
type HISTORY_FEATURE = Feature<Point, FEATURE_PROPS>

const fitBoundsOptions = { padding: 50 }

export const RecentContributionsMap: React.FC<{ history: ChangesetType[] }> = ({ history }) => {
  const features = history.reduce < HISTORY_FEATURE[] >((acc, curr, index) => {
    /**
     * Find 1 change with lat/lng
     */
    let lnglat: [number, number] | null = null
    let name: string = ''
    for (const change of curr.changes) {
      const doc = change.fullDocument as MetadataWithLatLng
      if (doc.metadata?.lng != null && doc.metadata?.lat != null) {
        lnglat = [doc.metadata.lng, doc.metadata.lat]
        // @ts-expect-error
        name = doc?.name ?? doc.areaName ?? ''
        break
      }
    }

    if (lnglat != null) {
      const feature = point<FEATURE_PROPS>(lnglat, { historyIndex: index, name }, { id: index })
      acc.push(feature)
    }
    return acc
  }, [])

  const mapRef = useRef<MapRef>(null)

  const fc = featureCollection(features)
  const bbox = bboxFn(fc) as BBox2d

  const [lastMarker, setLastMarker] = useState<LngLat | null>(null)
  const [selectedFeatures, setSelectedFeatures] = useState<HISTORY_FEATURE[]>([])

  /**
   * On click handler.  Zoom in on cluster or show popup.
   */
  const onClick = async (event: maplibregl.MapLayerMouseEvent): Promise<void> => {
    if (mapRef.current == null) return
    const feature = event?.features?.[0]

    if ((event?.features?.length ?? 0) > 0 && event?.features?.[0]?.layer.id === labelLayer.id) {
      setLastMarker(event.lngLat)
      setSelectedFeatures(event.features as unknown as HISTORY_FEATURE[])
      return
    }

    setLastMarker(null)
    setSelectedFeatures([])
    if (feature == null || feature?.properties?.cluster_id == null) {
      return
    }
    const clusterId = feature.properties.cluster_id

    const mapboxSource = mapRef?.current?.getSource('areas') as GeoJSONSource

    const zoom = await mapboxSource.getClusterExpansionZoom(clusterId)

    mapRef?.current?.easeTo({
      center: (feature.geometry as Point).coordinates as [number, number],
      zoom,
      duration: 800
    })
  }

  const clickableLayer1 = clusterLayer.id
  const clickableLayer2 = labelLayer.id

  return (
    <div className='relative w-full h-full'>
      <Map
        reuseMaps
        mapStyle={MAP_STYLES.dataviz.style}
        cooperativeGestures
        {...clickableLayer1 != null && clickableLayer2 != null &&
        { interactiveLayerIds: [clickableLayer2, clickableLayer1] }}
        onClick={(e) => { void onClick(e) }}
        ref={mapRef}
        initialViewState={{
          bounds: bbox,
          fitBoundsOptions
        }}
      >
        <Panel features={selectedFeatures} history={history} onClose={() => setSelectedFeatures([])} />
        <RecentEditsLayer geojson={fc} />
        <UnclusteredSource geojson={fc} />
        <FullscreenControl />
        <NavigationControl showCompass={false} />

        {lastMarker != null && <Marker longitude={lastMarker.lng} latitude={lastMarker.lat}><div className='z-20 w-8 h-8 bg-accent/50 border rounded' /></Marker>}

        <div className='absolute bottom-8 right-2'>
          <button className='btn btn-sm' onClick={() => mapRef.current?.fitBounds(bbox, fitBoundsOptions)}>Reset</button>
        </div>
      </Map>
    </div>
  )
}

const Panel: React.FC<{ features: Array<Feature<Point, FEATURE_PROPS>>, history: ChangesetType[], onClose: () => void }> = ({ features, history, onClose }) => {
  if (features.length === 0) return null
  return (
    <div className='absolute top-2 left-2 card card-compact card-bordered bg-base-100 max-h-[300px] overflow-hidden'>
      <div className='overflow-y-auto p-2'>
        {features.map((feature) => {
          const changeset = history[feature.properties.historyIndex]
          return <ChangesetCard key={feature.id} changeset={changeset} />
        })}
      </div>
      <div className='mx-auto'>
        <button className='btn btn-sm btn-wide' onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
