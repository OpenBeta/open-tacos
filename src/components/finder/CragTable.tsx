import { cragFiltersStore } from '../../js/stores'
import CragRow from './CragRow'
import { AreaType } from '../../js/types'

export default function CragTable (): JSX.Element {
  const { currentItems } = cragFiltersStore.use.pagination()
  return (
    <>
      <div className='mt-4 border-b border-b-slate-500' />
      {currentItems.map(
        (crag: AreaType) => <CragRow key={crag.id} {...crag} />
      )}
    </>
  )
}
