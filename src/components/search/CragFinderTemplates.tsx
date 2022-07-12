import Icon from '../Icon'
import CragsNearBy from './CragsNearBy'
interface PlaceTemplateType {
  placeName: string
  shortName: string
  placeId: string
  center: [number, number]
}

export const PlaceTemplate = ({ placeName, shortName, center, placeId }: PlaceTemplateType): JSX.Element => {
  return (
    <div
      className='px-4 py-4 rounded-lg border border-slate-500'
    >
      <div className='space-x-2 lg:space-x-4 flex flex-nowrap items-center'>
        <div className='rounded-md p-2 bg-slate-200'>
          <Icon className='fill-slate-900 stroke-white' type='droppin' />
        </div>
        <div className='text-base'>{placeName}</div>
      </div>

      <div className='w-full'>
        <CragsNearBy
          key={center.join()}
          center={center}
          placeId={placeId}
        />
      </div>
    </div>
  )
}

export const resultItemToUrl = (shortName: string, placeId: string, center: [number, number]): string => {
  return encodeURI(`/finder?shortName=${shortName}&placeId=${placeId}&center=${center.join(',')}`)
}
