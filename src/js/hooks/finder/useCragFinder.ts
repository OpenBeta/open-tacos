import { useEffect } from 'react'
import { NextRouter } from 'next/router'

import { actions, cragFinderStore } from '../../stores/index'

/* eslint-disable-next-line */
const useCragFinder = (router: NextRouter) => {
  const { query } = router

  useEffect(() => {
    try {
      const lnglat = parseCenterStr(query.center as string)
      const placeId = query?.placeId === undefined ? lnglat.join() : (query.placeId as string)
      const fetch = async (): Promise<any> => await actions.finder.validLnglat(query.shortName as string, placeId, lnglat)
      void fetch()
      // Todo: clear finder.errors
    } catch (e) {
      // Todo: set finder.errors
    }
  }, [query])
  return cragFinderStore
}

const parseCenterStr = (s: string): [number, number] => {
  const [_lng, _lat] = s.split(',')
  const lng = parseFloat(_lng)
  const lat = parseFloat(_lat)
  if (lat < -90 || lat > 90) {
    const message = 'LngLat [lat] must be within -90 to 90 degrees'
    throw new Error(message)
  } else if (lng < -180 || lng > 180) {
    const message = 'LngLat [lng] must be within -180 to 180 degrees'
    throw new Error(message)
  }
  return [lng, lat]
}

export default useCragFinder
