import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { graphqlClient } from '../../js/graphql/Client'

interface Crag {
  _id: string
  count: number
}

interface CragsNearByProps {
  center: [number, number]
  placeId: string
}

interface CragsNearData {
  cragsNear: Crag[]
}

const GET_CRAGS_NEAR = gql`
  query CragsNear($placeId: String, $lng: Float, $lat: Float, $maxDistance: Int) {
    cragsNear(placeId: $placeId, lnglat: { lat: $lat, lng: $lng }, maxDistance: $maxDistance) {
      count
      _id
      placeId
    }
  }
`

const CragsNearBy: React.FC<CragsNearByProps> = ({ center, placeId }) => {
  const { loading, data } = useQuery<CragsNearData>(GET_CRAGS_NEAR, {
    client: graphqlClient,
    variables: {
      placeId,
      lng: center[0],
      lat: center[1],
      maxDistance: 160000
    }
  })

  if ((data == null) || data.cragsNear.length === 0) {
    return null
  }

  if (loading) {
    return <div>{loading && 'loading'}</div>
  }

  return <CragDensity crags={data.cragsNear} />
}

export default CragsNearBy

interface CragDensityProps {
  crags: Crag[]
}

export const CragDensity: React.FC<CragDensityProps> = ({ crags }) => {
  return (
    <div className='mt-4 w-full'>
      <div className='flex items-end space-x-2 w-full'>
        {crags.map(({ _id, count }) => (
          <div key={_id} className='flex-1'>
            <div className='text-xl text-center'>{count}</div>
            <div className='text-center text-xs text-secondary'>
              {LABELS[_id]?.label || LABELS.theRest.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface Labels {
  [key: string]: {
    label: string
    width: number
  }
}

export const LABELS: Labels = {
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
