import { cragFiltersStore } from '../../js/stores'
import CragRow from './CragRow'

const CragTable = (): JSX.Element => {
  const { currentItems } = cragFiltersStore.use.pagination()
  return (
    <>
      <div className='mt-4 border-b border-b-slate-500' />
      {currentItems.map(
        (crag) => <CragRow key={crag.id} {...crag} />
      )}
    </>
  )
}
export default CragTable
