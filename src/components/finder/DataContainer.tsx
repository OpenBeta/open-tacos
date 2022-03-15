import { useRouter } from 'next/router'
import useCragFinder from '../../js/hooks/finder/useCragFinder'
import { CragDensity, LABELS } from '../search/CragsNearBy'
import CragTable from './CragTable'
import { TwoColumnLayout } from './TwoColumnLayout'

const DataContainer = (): JSX.Element => {
  const cragFinderStore = useCragFinder(useRouter())

  const { total, searchText, groups, isLoading } = cragFinderStore.useStore()

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
      right={<div>Map (TBD)</div>}
    />
  )
}

export default DataContainer

const Preface = ({ isLoading, total, searchText }: {isLoading: boolean, total: number, searchText: string}): JSX.Element => (
  <section className='mt-4 text-sm'>
    <div>
      {isLoading
        ? `Loading crags in ${searchText}...`
        : `${humanizeNumber(total)} crags in ${searchText}`}
    </div>
    <div>Consult local climbing community and guidebooks before you visit.</div>
  </section>
)
const humanizeNumber = (n: number): string => n > 300 ? '300+' : n.toString()
