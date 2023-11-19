'use client'
import { AreaType } from '@/js/types'
import { AreaItem } from './AreaItem'

type AreaListProps = Pick<AreaType, 'uuid' | 'areaName' | 'pathTokens' | 'ancestors'> & {
  areas: AreaType[]
}

export const AreaList: React.FC<AreaListProps> = ({ areaName, uuid, pathTokens, ancestors, areas }) => {
  return (
    <div className='card card-compact card-bordered border-base-300/40  overflow-hidden w-full'>

      <div className='form-control'>
        <div className='p-6'>
          <label className='flex flex-col items-start justify-start gap-2 pb-2'>
            <div className='flex items-baseline gap-4'>
              <h2 className='font-semibold text-2xl'>Child areas</h2>
              <div className='text-secondary text-sm'>Total: <span>{areas.length}</span></div>
            </div>
          </label>
          <div className='two-column-table'>
            {areas.map((item, index) =>
              <AreaItem key={item.uuid} area={item} index={index + 1} parentUuid={uuid} />)}
          </div>
        </div>
      </div>
      {/* <BreadCrumbs ancestors={ancestors} pathTokens={pathTokens} isClimbPage={false} /> */}

    </div>
  )
}
