import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { Feature, Geometry, featureCollection, point, Properties } from '@turf/helpers'

import CragsMap from '../maps/CragsMap'
import useCragFinder from '../../js/hooks/finder/useCragFinder'
import { CragDensity, LABELS } from '../search/CragsNearBy'
import CragTable from './CragTable'
import TwoColumnLayout from './TwoColumnLayout'
import { sanitizeName } from '../../js/utils'

const DataContainer = (): JSX.Element => {
  const cragFinderStore = useCragFinder(useRouter())
  const { total, searchText, groups, isLoading } = cragFinderStore.useStore()
  const points: Array<Feature<Geometry, Properties>> = groups !== undefined && groups.length > 0
    ? groups[0].crags.map(
      ({ area_name: name, metadata }) => point([metadata.lng, metadata.lat], { name: sanitizeName(name) })
    )
    : []

  const lnglat = cragFinderStore.use.lnglat()
  const geojson = featureCollection(points)
  const map = useMemo(() => <CragsMap geojson={geojson} center={lnglat} />, [geojson, lnglat])

  return (
    <TwoColumnLayout
      left={
        <>
          <Preface isLoading={isLoading} total={total} searchText={searchText} />
          <CragDensity crags={groups} />
          {groups.map(({ _id, crags, total }) => {
            return <CragTable key={_id} subheader={LABELS[_id].label} crags={crags} />
          })}
        </>
}
      right={map}
    />
  )
}

export default DataContainer

const Preface = ({ isLoading, total, searchText }: {isLoading: boolean, total: number, searchText: string}): JSX.Element => (
  <section className='mt-32 text-sm'>
    <div>
      {isLoading
        ? `Loading crags in ${searchText}...`
        : `${humanizeNumber(total)} crags near ${searchText}`}
    </div>
    <div>Consult local climbing community and guidebooks before you visit.</div>
  </section>
)
const humanizeNumber = (n: number): string => n > 300 ? '300+' : n.toString()
