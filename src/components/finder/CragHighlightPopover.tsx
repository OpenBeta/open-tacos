import { memo } from 'react'
import Link from 'next/link'
import { Popover } from '@headlessui/react'
import { XIcon } from '@heroicons/react/solid'

import { sanitizeName } from '../../js/utils'
import { AreaType } from '../../js/types'
import DTable from '../ui/DTable'
import { actions } from '../../js/stores'

/* eslint-disable-next-line */
function CragHighlightPopover({ id, area_name: _name, aggregate}: AreaType): JSX.Element {
  const name = sanitizeName(_name)
  return (
    <Popover>
      <Popover.Panel static>
        <Link href={`crag/${id}`}>
          <a>
            <div
              className='p-2 rounded-md bg-white border-2 border-slate-800 drop-shadow-xl min-w-[400px]'
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
