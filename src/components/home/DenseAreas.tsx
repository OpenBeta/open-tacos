import FeatureCard from '../ui/FeatureCard'
import { AreaType } from '../../js/types'

interface Props {
  areas: AreaType[]
}
export default function DenseAreas ({ areas }: Props): JSX.Element {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 lg:gap-x-3 gap-y-3'>
      {areas.map(area => <FeatureCard key={area.id} area={area} />)}
    </div>
  )
}
