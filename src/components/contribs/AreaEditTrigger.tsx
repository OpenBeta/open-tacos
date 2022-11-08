import { useRef, useState, useCallback } from 'react'
import { PencilIcon, FolderPlusIcon, FolderMinusIcon, ChevronDoubleDownIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'

import { MobileDialog, DialogContent } from '../ui/MobileDialog'
import { DropdownMenu, DropdownContent, DropdownItem, DropdownTrigger, DropdownSeparator } from '../ui/DropdownMenu'
import AddChildAreaForm from './AddChildAreaForm'
import DeleteAreaForm from './DeleteAreaForm'
import EditAreaForm from './EditAreaForm'
import { useResponsive } from '../../js/hooks'
import { AreaType, ChangesetType } from '../../js/types'
import RecentChangeHistory from '../../components/contribs/RecentChangeHistory'

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

  const { areaName, uuid, children, climbs, ancestors, history } = props
  const router = useRouter()

  const parentUuid = ancestors[ancestors.length - 2]

  const postCreateUpdateHandler = useCallback(() => {
    setAction('none')
    if (submitCountRef.current > 0) {
      // the user has edited something --> let's reload this page
      router.reload()
    }
  }, [action])

  const postDeleteHandler = async (): Promise<void> => {
    setAction('none')
    await router.replace('/areas/' + parentUuid)
    router.reload()
  }

  const isCountry = ancestors.length === 1
  const hasChildren = children?.length > 0 || climbs?.length > 0
  const deletable = !isCountry && !hasChildren
  return (
    <>
      <DropdownMenu>
        <DropdownTrigger className='btn btn-primary btn-sm w-full md:w-fit gap-2 items-center'>
          Edit <ChevronDoubleDownIcon className='w-3 h-3 lg:w-4 lg:w-4' />
        </DropdownTrigger>

        <DropdownContent align={isMobile ? 'center' : 'end'}>
          <DropdownItem
            text='Change history'
            onSelect={() => setAction('history')}
          />
          <DropdownSeparator />
          <DropdownItem
            className='font-bold'
            icon={<PencilIcon className='w-5 h-5' />}
            text='Edit'
            onSelect={() => setAction('edit')}
          />
          <DropdownSeparator />
          <DropdownItem
            className='font-bold'
            icon={<FolderPlusIcon className='w-5 h-5' />}
            text='Add new area'
            onSelect={() => setAction('add')}
          />
          <DropdownSeparator />
          <DropdownItem
            icon={<FolderMinusIcon className='w-5 h-5' />}
            className='text-content-200 font-light'
            text='Delete this area'
            onSelect={() => setAction('delete')}
            disabled={!deletable}
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
          <AddChildAreaForm parentName={areaName} parentUuid={uuid} formRef={submitCountRef} />
        </DialogContent>
      </MobileDialog>

      <MobileDialog modal open={action === 'delete'} onOpenChange={postCreateUpdateHandler}>
        <DialogContent title='Delete area'>
          <DeleteAreaForm
            areaName={areaName}
            areaUuid={uuid}
            parentUuid={parentUuid}
            onClose={postDeleteHandler}
          />
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
