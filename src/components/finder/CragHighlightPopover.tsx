import { memo } from 'react'
import Link from 'next/link'
import { Popover } from '@headlessui/react'
import { XIcon } from '@heroicons/react/solid'

import { sanitizeName } from '../../js/utils'
import { AreaType } from '../../js/types'
import DTable from '../ui/DTable'
import { actions } from '../../js/stores'

function CragHighlightPopover (props: AreaType | undefined): JSX.Element {
  if (props == null) return null
  const { areaName, aggregate, metadata } = props
  const name = sanitizeName(areaName)
  const { areaId } = metadata
  return (
    <Popover>
      <Popover.Panel static>
        <Link href={`crag/${areaId}`}>
          <a>
            <div
              className='p-2 rounded-md bg-white border-2 border-slate-800 drop-shadow-xl'
            >
              <header className='flex justify-between items-center'>
                <div className='text-base font-semibold text-primary'>
                  {name}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    actions.filters.deactivateActiveMarker()
                  }}
                  className='-mt-0.5 p-1 rounded-full hover:bg-slate-200'
                >
                  <XIcon className='w-4 h-4 text-slate-600' />
                </button>
              </header>
              <hr className='' />
              <DTable byDisciplineAgg={aggregate.byDiscipline} />
            </div>
          </a>
        </Link>
      </Popover.Panel>
    </Popover>

  )
}

export default memo(CragHighlightPopover)
