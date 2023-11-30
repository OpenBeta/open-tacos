'use client'
import { AreaType } from '@/js/types'
import { AreaItem } from './AreaItem'
import { GluttenFreeCrumbs } from '@/components/ui/BreadCrumbs'

type AreaListProps = Pick<AreaType, 'uuid' | 'areaName' | 'pathTokens' | 'ancestors'> & {
  areas: AreaType[]
}

export const AreaListForm: React.FC<AreaListProps> = ({ areaName, uuid, pathTokens, ancestors, areas }) => {
  return (
    <div id='children' className='card card-compact card-bordered border-base-300/50  overflow-hidden w-full'>
      <div className='form-control'>
        <div className='p-6'>
          {/* Heading */}
          <label className='flex flex-col items-start justify-start gap-2 pb-2'>
            <div className='flex items-baseline gap-4'>
              <h4 className='font-semibold text-2xl'>Child areas</h4>
              <div className='text-secondary text-sm'>Total: <span>{areas.length}</span></div>
            </div>
          </label>

          <GluttenFreeCrumbs ancestors={ancestors} pathTokens={pathTokens} editMode />

          <hr className='border-1 mb-6' />

          <AreaList areas={areas} parentUuid={uuid} editMode />
        </div>
      </div>
    </div>
  )
}

export const AreaList: React.FC<{ parentUuid: string, areas: AreaType[], editMode?: boolean }> = ({ areas, parentUuid, editMode = false }) => (
  <div className='two-column-table'>
    {areas.map((item, index) =>
      <AreaItem key={item.uuid} area={item} index={index + 1} parentUuid={parentUuid} editMode={editMode} />)}
  </div>)
