import FeatureCard from '../ui/FeatureCard'
import { AreaType } from '../../js/types'

export interface ExploreProps {
  areas: AreaType[]
}
export default function Explore ({ areas }: ExploreProps): JSX.Element {
  return (
    <div className='mx-0 lg:mx-4 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 lg:gap-x-3 gap-y-3'>
      {areas.map(area => <FeatureCard key={area.id} area={area} />)}
    </div>
  )
}
