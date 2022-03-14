import CragRow from './CragRow'

const CragTable = ({ crags, subheader }: { crags: any[], subheader: string }): JSX.Element => {
  return (
    <div className=''>
      {crags.map((crag) => <CragRow key={crag.id} {...crag} />)}
    </div>
  )
}
export default CragTable
