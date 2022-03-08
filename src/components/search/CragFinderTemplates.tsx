import { NextRouter } from 'next/router'
import Icon from '../Icon'
import CragsNearBy from './CragsNearBy'
interface PlaceTemplateType {
  placeName: string
  center: [number, number]
  router: NextRouter
}

interface CragFinderResultsProps {
  features: any[]
  router: NextRouter
}
/**
 * Template for rendering indiviual search result item
 * @param param0
 * @returns
 */
export const CragFinderResults = ({ features, router }: CragFinderResultsProps): JSX.Element => {
  return (
    <div>
      {/* <PlaceHeader typeKeys={groupKey} /> */}
      <div>
        {features.map(
          ({ feature }) => <PlaceTemplate key={feature.id} placeName={feature.place_name} center={feature.center} router={router} />
        )}
      </div>
    </div>
  )
}

// const PlaceHeader = ({ typeKeys }: {typeKeys: string[]}): JSX.Element =>
//   (
//     <div className='border-b border-gray-700 my-2.5'>
//       <div className='flex space-x-2'>{typeKeys.map(item =>
//         (<span key={item} className='uppercase font-bold'>{item}</span>))}
//       </div>
//     </div>)

/**
 * How to render individual climb in search results
 *
 */

export const PlaceTemplate = ({ placeName, center, router }: PlaceTemplateType): JSX.Element => {
  // const url = `/climbs/${climbId}`
  return (
    <div className='px-4 py-4'>
      <div className=' space-x-2 lg:space-x-4 flex flex-nowrap items-center '>
        <div className='rounded-md p-2 bg-slate-100'>
          <Icon className='fill-slate-900 stroke-white' type='droppin' />
        </div>
        <div>{placeName}</div>
      </div>
      <div><CragsNearBy key={center.join('-')} center={center} /></div>
    </div>
  )
}
