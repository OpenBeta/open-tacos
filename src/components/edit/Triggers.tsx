import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/20/solid'
import { MobileDialog, DialogContent, DialogTrigger } from '../ui/MobileDialog'
import DeleteAreaForm, { DeleteAreaProps } from './DeleteAreaForm'
import AddAreaForm, { AddAreaFormProps } from './AddChildAreaForm'
import { toast } from 'react-toastify'

export const DeleteAreaTrigger = ({ areaName, areaUuid, parentUuid, disabled }: DeleteAreaProps & { disabled: boolean}): JSX.Element => {
  const [isOpen, setOpen] = useState(false)
  const onSuccess = (): void => {
    setOpen(false)
    toast.info(`Area '${areaName}' deleted.`)
  }
  return (
    <MobileDialog modal open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger className='btn btn-primary btn-sm btn-outline px-6' disabled={disabled}>Delete</DialogTrigger>
      <DialogContent title='Delete area'>
        <DeleteAreaForm
          areaName={areaName}
          areaUuid={areaUuid}
          parentUuid={parentUuid}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </MobileDialog>
  )
}

export const AddAreaTrigger = ({ parentName, parentUuid, disabled }: Omit<AddAreaFormProps, 'onSuccess' | 'onError'> & { disabled: boolean}): JSX.Element => {
  const [isOpen, setOpen] = useState(false)

  const onSuccess = (): void => {
    setOpen(false)
  }

  return (
    <>
      <MobileDialog modal open={isOpen} onOpenChange={setOpen}>
        <DialogTrigger className='btn btn-secondary btn-outline border-dashed border-2 gap-2 btn-wide' disabled={disabled}>
          <PlusIcon className='stroke-2 w-5 h-5' />
          Add New Area
        </DialogTrigger>
        <DialogContent title='Add area'>
          <AddAreaForm
            parentName={parentName}
            parentUuid={parentUuid}
            onSuccess={onSuccess}
          />
        </DialogContent>
      </MobileDialog>
    </>
  )
}
