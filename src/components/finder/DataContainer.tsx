import { useRouter } from 'next/router'
// import { actions } from '../../js/stores/index'
import useCragFinder from '../../js/hooks/finder/useCragFinder'
import { CragDensity, LABELS } from '../search/CragsNearBy'
import CragTable from './CragTable'
import { TwoColumnLayout } from './TwoColumnLayout'

const DataContainer = (): JSX.Element => {
  const cragFinderStore = useCragFinder(useRouter())

  const { total, searchText, groups } = cragFinderStore.useStore()

  // console.log(groups)
  return (
    <TwoColumnLayout
      left={
        <>
          <Preface total={total} searchText={searchText} />
          <CragDensity crags={groups} />
          {groups.map(({ _id, crags, total }) => {
            return <CragTable key={_id} subheader={LABELS[_id].label} crags={crags} />
          })}
        </>
}
      right={<div>MAP (TBD)</div>}
    />
  )
}

export default DataContainer

const Preface = ({ total, searchText }: {total: number, searchText: string}): JSX.Element => (
  <section className='mt-4 text-sm'><div>{humanizeNumber(total)} crags in {searchText}</div>
    <div>Consult local climbing community and guidebooks before you visit.</div>
  </section>
)
const humanizeNumber = (n: number): string => n > 300 ? '300+' : n.toString()
