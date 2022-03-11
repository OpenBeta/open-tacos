import React from 'react'
import {
  gql,
  useQuery
} from '@apollo/client'
import { graphqlClient } from '../../js/graphql/Client'
import DensityBar from '../ui/Statistics/DensityBar'

const GET_CRAGS_NEAR = gql`query CragsNear($lng: Float, $lat: Float, $maxDistance: Int) {
    cragsNear(lnglat: {lat: $lat, lng: $lng}, maxDistance: $maxDistance) {
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

  if (loading) {
    return (
      <div>{loading && 'loading'}</div>
    )
  }

  return (
    <div className='mt-4 ml-16 flex flex-col w-full'>
      <div className='flex items-end space-x-6'>
        <div className='mb-4 text-sm font-semibold px-4 bg-gray-400 rounded-md'>Crag density</div>
        {data.cragsNear.slice(0, 2).map(
          ({ _id, count }: {_id: string, count: number}) => {
            return (
              <div key={_id} className='flex flex-col'>
                <div className='ml-0.5'><DensityBar level={cragDensityLevel(count)} max={4} /></div>
                <div className='mt-0.5 border-t border-slate-800 text-xs text-secondary'>{LABELS[_id].label}</div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default CragsNearBy

const LABELS = {
  0: {
    label: 'under 1 hr',
    width: 4
  },
  48: {
    label: '1 to 2 hrs',
    width: 8
  },
  96: {
    label: '2 to 3 hrs',
    width: 16
  },
  theRest: {
    label: 'more than 3hrs',
    width: 20
  }
}

const cragDensityLevel = (count: number): number => {
  const score = count / 20
  if (score < 1) {
    return 0
  } else if (score > 1 && score < 5) {
    return 1
  } else if (score > 5 && score < 10) {
    return 2
  } else return 4
}
