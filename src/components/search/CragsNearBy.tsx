import React from 'react'
import {
  gql,
  useQuery
} from '@apollo/client'
import { graphqlClient } from '../../js/graphql/Client'
import DensityBar from '../ui/Statistics/DensityBar'

const GET_CRAGS_NEAR = gql`query CragsNear($placeId: String, $lng: Float, $lat: Float, $maxDistance: Int) {
    cragsNear(placeId: $placeId, lnglat: {lat: $lat, lng: $lng}, maxDistance: $maxDistance) {
        count
        _id
        placeId
    }
  }`

const CragsNearBy = ({ center, placeId }: {center: [number, number], placeId: string}): JSX.Element| null => {
  const { loading, data } = useQuery(GET_CRAGS_NEAR, {
    client: graphqlClient,
    variables: {
      placeId,
      lng: center[0],
      lat: center[1],
      maxDistance: 160000
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
    <CragDensity crags={data.cragsNear} />
  )
}

export default CragsNearBy

export const CragDensity = ({ crags }: {crags: any[]}): JSX.Element => {
  return (
    <div className='pl-16 mt-4 w-full'>
      <span className='text-xs px-2 py-1 bg-slate-500 text-white'>Crags near by</span>
      <div className='mt-4 flex items-end space-x-4 w-full'>
        {crags.map(
          ({ _id, count }: {_id: string, count: number}) => {
            return (
              <div key={_id} className='flex flex-col'>
                <div className=''><DensityBar level={cragDensityLevel(count)} max={4} /></div>
                <div className='mt-0.5 border-t border-slate-800 text-xs text-secondary whitespace-nowrap'>{LABELS[_id].label}</div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export const LABELS = {
  0: {
    label: 'Under 30 miles',
    width: 4
  },
  48: {
    label: '30 - 60 miles',
    width: 8
  },
  96: {
    label: '60 - 100 miles',
    width: 16
  },
  160: {
    label: '100 - 150 miles',
    width: 16
  },
  theRest: {
    label: 'More than 150 miles',
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
  } else {
    return 3
  }
}
