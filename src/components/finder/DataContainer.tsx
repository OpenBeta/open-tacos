import { useRouter } from 'next/router'
// import { actions } from '../../js/stores/index'
import useCragFinder from '../../js/hooks/finder/useCragFinder'

const DataContainer = (): JSX.Element => {
  const cragFinderStore = useCragFinder(useRouter())

  const { total, searchText, crags } = cragFinderStore.useStore()

  console.log(crags)
  return (
    <div className='mt-24'>
      <div className='text-sm'><div>{humanizeNumber(total)} crags in {searchText}</div>
        <div>Consult local climbing community and guidebooks before you visit.</div>
      </div>
    </div>
  )
}

export default DataContainer

const humanizeNumber = (n: number): string => n > 300 ? '300+' : n.toString()
