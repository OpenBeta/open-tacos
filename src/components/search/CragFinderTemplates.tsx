import { NextRouter } from 'next/router'
import Icon from '../Icon'
import CragsNearBy from './CragsNearBy'
interface PlaceTemplateType {
  placeName: string
  shortName: string
  placeId: string
  center: [number, number]
  router: NextRouter
}

// interface CragFinderResultsProps {
//   features: any[]
//   router: NextRouter
// }
/**
 * Template for rendering indiviual search result item
 * @param param0
 * @returns
 */
// export const CragFinderResults = ({ features, router }: CragFinderResultsProps): JSX.Element => {
//   return (
//     <div>
//       {/* <PlaceHeader typeKeys={groupKey} /> */}
//       <div>
//         {features.map(
//           ({ feature }) => <PlaceTemplate key={feature.id} placeName={feature.place_name} center={feature.center} router={router} />
//         )}
//       </div>
//     </div>
//   )
// }

export const PlaceTemplate = ({ placeName, shortName, center, placeId, router }: PlaceTemplateType): JSX.Element => {
  return (
    <div
      className='px-4 py-4'
      onClick={async () =>
        await router.push({
          pathname: '/finder',
          query: {
            shortName,
            placeId,
            center: center.join(',')
          }
        }, null, { shallow: true })}
    >
      <div className='space-x-2 lg:space-x-4 flex flex-nowrap items-center'>
        <div className='rounded-md p-2 bg-slate-200'>
          <Icon className='fill-slate-900 stroke-white' type='droppin' />
        </div>
        <div className='text-base'>{placeName}</div>
      </div>
      <div><CragsNearBy key={center.join()} center={center} placeId={placeId} /></div>
    </div>
  )
}

export const resultItemToUrl = (shortName: string, placeId: string, center: [number, number]): string => {
  return encodeURI(`/finder?shortName=${shortName}&placeId=${placeId}&center=${center.join(',')}`)
}
