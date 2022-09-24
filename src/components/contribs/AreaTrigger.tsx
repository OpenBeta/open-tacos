import { useRef, useState, useCallback } from 'react'
import { PencilIcon, FolderAddIcon, FolderRemoveIcon, ChevronDoubleDownIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'

import { MobileDialog, DialogContent } from '../ui/MobileDialog'
import { DropdownMenu, DropdownContent, DropdownItem, DropdownTrigger, DropdownSeparator } from '../ui/DropdownMenu'
import AddChildAreaForm from './AddChildAreaForm'
import DeleteAreaForm from './DeleteAreaForm'
import AreaEditForm from './AreaEditForm'
import { AreaType } from '../../js/types'

interface AreaEditActionTriggerProps extends AreaType {

}

export default function AreaTrigger (props: AreaEditActionTriggerProps): JSX.Element {
  const submitCountRef = useRef<number>(0)
  const [action, setAction] = useState('none')

  const { areaName, uuid, ancestors } = props
  const deletable = ancestors.length > 1
  const router = useRouter()

  const parentUuid = ancestors[ancestors.length - 2]

  const closeAndReloadHandler = useCallback(() => {
    setAction('none')
    if (submitCountRef.current > 0) {
      // the user has edited something --> let's reload this page
      router.reload()
    }
  }, [])

  return (
    <>
      <DropdownMenu>
        <DropdownTrigger className='btn btn-primary btn-xs w-full md:w-fit gap-2'>Edit <ChevronDoubleDownIcon className='w-4 h-4' /></DropdownTrigger>
        <DropdownContent>
          <DropdownItem
            className='font-bold'
            icon={<PencilIcon className='w-5 h-5' />}
            text='Edit'
            onSelect={() => setAction('edit')}
          />
          <DropdownSeparator />
          <DropdownItem
            className='font-bold'
            icon={<FolderAddIcon className='w-5 h-5' />}
            text='Add new area'
            onSelect={() => setAction('add')}
          />
          <DropdownSeparator />
          <DropdownItem
            icon={<FolderRemoveIcon className='w-5 h-5' />}
            text='Delete this area'
            onSelect={() => setAction('delete')}
            disabled={!deletable}
          />
          <DropdownSeparator />
          <DropdownItem text='Cancel' />
        </DropdownContent>
      </DropdownMenu>

      <MobileDialog modal open={action === 'edit'} onOpenChange={closeAndReloadHandler}>
        <DialogContent title='Edit area'>
          <AreaEditForm {...props} formRef={submitCountRef} />
        </DialogContent>
      </MobileDialog>

      <MobileDialog modal open={action === 'add'} onOpenChange={closeAndReloadHandler}>
        <DialogContent title='Add new child area'>
          <AddChildAreaForm parentName={areaName} parentUuid={uuid} formRef={submitCountRef} />
        </DialogContent>
      </MobileDialog>

      <MobileDialog modal open={action === 'delete'} onOpenChange={closeAndReloadHandler}>
        <DialogContent title='Delete area'>
          <DeleteAreaForm
            areaName={areaName}
            areaUuid={uuid}
            parentUuid={parentUuid}
            onClose={() => {
              setAction('none')
              void router.replace('/areas/' + parentUuid)
            }}
          />
        </DialogContent>
      </MobileDialog>
    </>
  )
}
