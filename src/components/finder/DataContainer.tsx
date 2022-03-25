import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { Feature, Geometry, featureCollection, point, Properties } from '@turf/helpers'

import CragsMap from '../maps/CragsMap'
import useCragFinder from '../../js/hooks/finder/useCragFinder'
import CragTable from './CragTable'
import TwoColumnLayout from './TwoColumnLayout'
import { sanitizeName } from '../../js/utils'
import { AreaType } from '../../js/types'
import Pagination from './Pagination'

const DataContainer = (): JSX.Element => {
  const cragFiltersStore = useCragFinder(useRouter())
  const { lnglat, total, searchText, crags, isLoading } = cragFiltersStore.useStore()

  const points: Array<Feature<Geometry, Properties>> =
  crags.map((crag: AreaType) => {
    const { area_name: name, metadata } = crag
    return point([metadata.lng, metadata.lat], { name: sanitizeName(name) })
  }
  )

  const geojson = featureCollection(points)
  const map = useMemo(() => <CragsMap geojson={geojson} center={lnglat} />, [geojson, lnglat])
  return (
    <TwoColumnLayout
      left={
        <>
          <Preface isLoading={isLoading} total={total} searchText={searchText} />
          <CragTable />
          <Pagination />
        </>
}
      right={map}
    />
  )
}

export default DataContainer

const Preface = ({ isLoading, total, searchText }: {isLoading: boolean, total: number, searchText: string}): JSX.Element => (
  <section className='mt-36 px-2 py-3 text-sm border border-b-2 border-slate-600 rounded-md'>
    <div>
      {isLoading
        ? `Loading crags in ${searchText}...`
        : `${humanizeNumber(total)} crags near ${searchText}`}
    </div>
    <div>Consult local climbing community and guidebooks before you visit.</div>
  </section>
)
const humanizeNumber = (n: number): string => n > 300 ? '300+' : n.toString()
