import BaseMap from '../maps/BaseMap'
import { Marker } from 'react-map-gl'
import contributorsData from '../../assets/contributors-map.json'
import useAutoSizing from '../../js/hooks/finder/useMapAutoSizing'
import { MobileDialog, DialogContent, DialogTrigger } from '../ui/MobileDialog'
import { MapPinIcon, UsersIcon } from '@heroicons/react/24/outline'
import { XViewStateType } from '../../js/types'
import { useEffect } from 'react'

export interface ContributorType{
  firstName?: string
  githubId?: string
  favoriteCrag?: string
}
interface ContributorDataType{
  properties: ContributorType
  type: string
  geometry: GeometryType
}

interface MapProps{contributor: ContributorType}

const ContributorCardTrigger: React.FC<MapProps> = ({ contributor }) => {
  return (
    <MobileDialog modal>
      <DialogTrigger asChild>
        <div className=''>
          <MapPinIcon className='h-12 w-12 rounded-lg' />
        </div>
      </DialogTrigger>
      <DialogContent small>
        <ContributorCard contributor={contributor} />
      </DialogContent>
    </MobileDialog>
  )
}

const ContributorCard: React.FC<MapProps> = ({ contributor }) => {
  const { firstName, githubId, favoriteCrag } = contributor
  return (

    <div className='grid md:grid-cols-6 px-11 pt-11 pb-16 gap-2 md:gap-4 bg-white rounded-lg'>

      <div className='md:col-span-1'>
        <UsersIcon className='h-12 w-12 rounded-lg border-slate-100 border' />
      </div>
      <div className='gap-10 md:col-span-5'>

        <p className='text-base-content/60 font-semibold'>{firstName}</p>

        {githubId != null &&
          <a
            className='underline pb-4'
            target='_blank'
            rel='noreferrer'
            href={`github.com/${githubId}`}
          >GitHub
          </a>}

        {favoriteCrag != null && <p>Favorite crag: {favoriteCrag}</p>}
      </div>
    </div>
  )
}

interface GeometryType{
  type: string
  coordinates: number[]
}

export function ContributorMap (): JSX.Element {
  const mapElementId = 'contributors-map'

  const contributors: ContributorDataType[] = contributorsData.features

  const initialViewState: XViewStateType = {
    width: 300,
    height: 1024,
    padding: { top: 20, bottom: 20, left: 20, right: 20 },
    bearing: 0,
    zoom: 1,
    pitch: 0,
    latitude: 36.079693291728546,
    longitude: -115.5,
    bbox: [0, 0, 0, 0]
  }
  const [viewState, height, setViewState] = useAutoSizing({ geojson: null, elementId: mapElementId })

  useEffect(() => {
    setViewState(initialViewState)
  }, [])

  return (
    <>
      <div
        id={mapElementId}
        className='z-10 bg-gray-200'
        style={{ height }}
      >
        <BaseMap
          height={height}
          viewstate={viewState}
          onViewStateChange={setViewState}
          light
          interactiveLayerIds={[]}
        >
          {contributors.map((feature, index) => {
            return (
              <Marker
                key={index} longitude={feature.geometry.coordinates[0]}
                latitude={feature.geometry.coordinates[1]}
              >
                <ContributorCardTrigger contributor={feature.properties} />
              </Marker>
            )
          })}
        </BaseMap>
      </div>
    </>

  )
}
