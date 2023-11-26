import { EntityIcon } from 'app/editArea/[slug]/general/components/AreaItem'

export const AreaEntityBullet: React.FC = () => <span className='area-entity-box'><EntityIcon type='area' size={24} withLabel={false} /></span>

export const CragBoulderBullet: React.FC<{ isLeaf: boolean, isBoulder: boolean } > = ({ isBoulder, isLeaf }) => {
  return <span className='area-entity-box'><EntityIcon type='area' size={24} withLabel={false} /></span>
}
