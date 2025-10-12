'use client'
import { Source, Layer, LineLayer } from 'react-map-gl'
import { useCallback, useEffect, useState } from 'react'
import { CameraInfo, GlobalMap } from '@/components/maps/GlobalMap'
import { useRouter, useSearchParams } from 'next/navigation'
import { MapLayerMouseEvent } from 'maplibre-gl'
import { useUrlParams } from '@/js/hooks/useUrlParams'
import { lineString, Position } from '@turf/helpers'
import lineToPolygon from '@turf/line-to-polygon'
import { Search, X } from 'lucide-react'

export const FullScreenMap: React.FC = () => {
  const [center, setCenter] = useState<[number, number] | undefined>(undefined)
  const [zoom, setZoom] = useState<number | undefined>(undefined)
  const [areaId, setAreaId] = useState<string | undefined>(undefined)
  const [isInitialized, setIsInitialized] = useState(false)
  const [polygon, setPolygon] = useState<Position[] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const DEFAULT_ZOOM = 2

  const router = useRouter()
  const urlParams = useUrlParams()
  const searchParams = useSearchParams()

  // Handle initial state setup only once
  useEffect(() => {
    if (isInitialized) return

    const { camera, areaId: urlAreaId } = urlParams.fromUrl()

    if (urlAreaId != null) {
      setAreaId(urlAreaId)
    }

    // If camera params exist in URL, use them
    if (camera != null) {
      setCenter([camera.center.lng, camera.center.lat])
      setZoom(camera.zoom)
      setIsInitialized(true)
      return
    }

    // If no camera params, get visitor location and set URL
    setZoom(DEFAULT_ZOOM)
  }, [urlParams, isInitialized, router])

  const handleCameraMovement = useCallback(
    (camera: CameraInfo) => {
      const { areaId } = urlParams.fromUrl()
      const url = urlParams.toUrl({ camera, areaId })
      router.replace(url, { scroll: false })
    },
    [urlParams, router]
  )

  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const areaId = e.features?.[0]?.properties?.id ?? null
      const { camera } = urlParams.fromUrl()
      const url = urlParams.toUrl({ camera: camera ?? null, areaId })
      router.replace(url, { scroll: false })
    }, [urlParams, router]
  )

  useEffect(() => {
    const polygonParam = searchParams.get('polygon')
    if (polygonParam !== null && polygonParam !== '') {
      setPolygon(JSON.parse(decodeURIComponent(polygonParam)))
    }
  }, [searchParams])

  // Search functionality using Nominatim (OpenStreetMap)
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      )
      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSelectLocation = (result: any) => {
    const lat = parseFloat(result.lat)
    const lon = parseFloat(result.lon)
    
    setCenter([lon, lat])
    setZoom(12)
    setSearchQuery(result.display_name)
    setSearchResults([])

    // Update URL with new camera position
    const camera: CameraInfo = {
      center: { lng: lon, lat },
      zoom: 12
    }
    const { areaId } = urlParams.fromUrl()
    const url = urlParams.toUrl({ camera, areaId })
    router.replace(url, { scroll: false })
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
  }

  const boundary = Array.isArray(polygon) ? lineToPolygon(lineString(polygon), { properties: { name: 'Imported Polygon' } }) : null

  const locationParamsRaw = useSearchParams().get('bbox')
  const locationParams: [number, number, number, number] | undefined =
    locationParamsRaw != null && locationParamsRaw !== ''
      ? (locationParamsRaw.split(',').map(Number) as [number, number, number, number])
      : undefined

  const fitBoundOpts: maplibregl.FitBoundsOptions = { padding: { top: 45, left: 45, bottom: 45, right: 45 }, duration: 0, maxZoom: 12 }

  const areaPolygonStyle: LineLayer = {
    id: 'polygon',
    type: 'line',
    paint: {
      'line-opacity': ['step', ['zoom'], 0.85, 10, 0.5],
      'line-width': ['step', ['zoom'], 4, 8, 6],
      'line-color': 'rgb(219,39,119)',
      'line-blur': 4
    }
  }

  return (
    <div className="relative w-full h-full">
      {/* Search Bar */}
      <div className="absolute top-4 left-4 z-10 w-96 max-w-[calc(100vw-2rem)]">
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a location..."
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectLocation(result)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="font-medium text-gray-900 text-sm">
                    {result.display_name.split(',')[0]}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {result.display_name}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Loading State */}
          {isSearching && searchQuery && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl p-4 text-center text-gray-500 text-sm">
              Searching...
            </div>
          )}

          {/* No Results State */}
          {!isSearching && searchQuery && searchResults.length === 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl p-4 text-center text-gray-500 text-sm">
              No results found
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <GlobalMap
        showFullscreenControl={false}
        initialAreaId={areaId}
        initialCenter={center}
        initialViewState={
          locationParams !== undefined && locationParams !== null
            ? {
                bounds: locationParams,
                fitBoundsOptions: fitBoundOpts
              }
            : undefined
        }
        initialZoom={zoom}
        onCameraMovement={handleCameraMovement}
        handleOnClick={handleMapClick}
      >
        {boundary != null &&
          <Source id='child-areas-polygon' type='geojson' data={boundary}>
            <Layer {...areaPolygonStyle} />
          </Source>}
      </GlobalMap>
    </div>
  )
}