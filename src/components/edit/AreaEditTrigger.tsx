import { useRef, useState, useCallback } from 'react'
import { PencilIcon, PencilSquareIcon, FolderPlusIcon, ChevronDoubleDownIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'

import { MobileDialog, DialogContent } from '../ui/MobileDialog'
import { DropdownMenu, DropdownContent, DropdownItem, DropdownTrigger, DropdownSeparator } from '../ui/DropdownMenu'
import AddChildAreaForm from './AddChildAreaForm'
import EditAreaForm from './EditAreaForm'
import { useResponsive } from '../../js/hooks'
import { AreaType, ChangesetType } from '../../js/types'
import RecentChangeHistory from './RecentChangeHistory'

interface AreaEditActionTriggerProps extends AreaType {
  history: ChangesetType[]
}

/**
 * A responsive button (wider on mobile) to trigger Area edit popup menu.
 */
export default function AreaTrigger (props: AreaEditActionTriggerProps): JSX.Element {
  const { isMobile } = useResponsive()
  const submitCountRef = useRef<number>(0)
  const [action, setAction] = useState('none')
  const [shouldReloadPage, setShouldReloadPage] = useState(false)

  const { areaName, uuid, history } = props
  const router = useRouter()

  const postCreateUpdateHandler = useCallback(() => {
    setAction('none')
    if (submitCountRef.current > 0 || shouldReloadPage) {
      // the user has edited something --> let's reload this page
      router.reload()
    }
  }, [action, shouldReloadPage])

  return (
    <>
      <DropdownMenu>
        <DropdownTrigger className='btn btn-primary btn-sm w-full md:w-fit gap-2 items-center'>
          Edit <ChevronDoubleDownIcon className='w-3 h-3 lg:w-4 lg:w-4' />
        </DropdownTrigger>

        <DropdownContent align={isMobile ? 'center' : 'end'}>
          <DropdownItem
            text={`Change history (${history.length})`}
            onSelect={() => setAction('history')}
            disabled={history.length === 0}
          />
          <DropdownSeparator />
          <DropdownItem
            className='font-bold'
            icon={<PencilIcon className='w-5 h-5' />}
            text='Quick Edit'
            onSelect={() => setAction('edit')}
          />
          <DropdownSeparator />
          <DropdownItem
            icon={<FolderPlusIcon className='w-5 h-5' />}
            text='Add new area'
            onSelect={() => setAction('add')}
          />
          <DropdownSeparator />
          <DropdownItem
            icon={<PencilSquareIcon className='w-5 h-5' />}
            text='Advanced Edit'
            onSelect={() => { void router.push(`/crag/${props.uuid}`) }}
          />
          <DropdownSeparator />
          <DropdownItem text='Cancel' />
        </DropdownContent>
      </DropdownMenu>

      <MobileDialog modal open={action === 'edit'} onOpenChange={postCreateUpdateHandler}>
        <DialogContent title='Edit area'>
          <EditAreaForm {...props} formRef={submitCountRef} />
        </DialogContent>
      </MobileDialog>

      <MobileDialog modal open={action === 'add'} onOpenChange={postCreateUpdateHandler}>
        <DialogContent title='Add new child area'>
          <AddChildAreaForm parentName={areaName} parentUuid={uuid} onSuccess={() => setShouldReloadPage(true)} />
        </DialogContent>
      </MobileDialog>

      <MobileDialog modal open={action === 'history'} onOpenChange={postCreateUpdateHandler}>
        <DialogContent title='Change history'>
          <RecentChangeHistory history={history} />
        </DialogContent>
      </MobileDialog>
    </>
  )
}
