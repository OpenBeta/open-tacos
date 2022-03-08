import {
  gql,
  useQuery
} from '@apollo/client'
import { graphqlClient } from '../../js/graphql/Client'

const GET_CRAGS_NEAR = gql`query CragsNear($lng: Float, $lat: Float, $maxDistance: Int) {
    cragsNear(lnglat: {lat: $lat, lng: $lng}, maxDistance: $maxDistance) {
        crags {
            area_name
        }
        count
        _id
    }
  }`

const CragsNearBy = ({ center }: {center: [number, number]}): JSX.Element => {
  const { loading, data } = useQuery(GET_CRAGS_NEAR, {
    client: graphqlClient,
    variables: {
      lng: center[0],
      lat: center[1],
      maxDistance: 200000
    }
  })
  if (data === undefined || data.cragsNear.length === 0) {
    return null
  }

  // console.log(center, data)
  if (loading) {
    return (
      <div>{loading && 'loading'}</div>
    )
  }

  return (
    <div className='mt-4 ml-14 flex flex-col w-full'>
      <div className='text-sm font-bold'>Distance to crags</div>
      <div>
        {
        data.cragsNear.map(({ _id, count, crags }) => {
          return (
            <CragBadge key={_id} label={LABELS[_id].label} width={LABELS[_id].width} count={count} />
          )
        })
      }
      </div>
    </div>
  )
}

export default CragsNearBy

const CragBadge = ({ width, label, count }): JSX.Element => {
  return (
    <div className='flex items-center space-x-2'>
      {/* eslint-disable-next-line */}
      <div className='text-xs'>{label}</div><div className={`h-1 bg-gray-700 w-${width}`}>&nbsp;</div><div className='pl-2 text-sm'>{count}</div>
    </div>
  )
}

const LABELS = {
  0: {
    label: 'under 45 mins',
    width: 4
  },
  48: {
    label: '45m to 1.5 hrs',
    width: 8
  },
  96: {
    label: '1.5 to 2.5 hrs',
    width: 16
  },
  theRest: {
    label: '2.5 hrs or more',
    width: 20
  }
}

// const CragBadge = ({ label, count }): JSX.Element => {
//   return (
//     <div className='rounded border border-gray-800 text-xs flex justify-around'>
//       <div className='bg-gray-800 text-white'>&#8212;&#8212;</div><div className='px-4'>{count}</div>
//     </div>
//   )
// }
