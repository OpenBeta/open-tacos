import { useState, useCallback } from 'react'
import { PlusIcon, PlusCircleIcon } from '@heroicons/react/20/solid'
import { TrashIcon } from '@heroicons/react/24/outline'
import { MobileDialog, DialogContent, DialogTrigger } from '../ui/MobileDialog'
import DeleteAreaForm, { DeleteAreaProps } from './DeleteAreaForm'
import AddAreaForm, { AddAreaFormProps } from './AddChildAreaForm'
import { toast } from 'react-toastify'

export type DeleteAreaTriggerProps = DeleteAreaProps & { disabled?: boolean, children?: JSX.Element }
/**
 * A button used to trigger the Delete Area dialog.  You can pass an optional nested child component to customize the trigger button.
 *
 * Example:
 * ```
 * <DeleteAreaTrigger>
 *   <DeleteAreaTriggerButtonSm disabled={!canEdit}/>
 * </DeleteAreaTrigger>
 * ```
 */
export const DeleteAreaTrigger = ({ areaName, areaUuid, parentUuid, disabled = false, returnToParentPageAfterDelete, onSuccess, children }: DeleteAreaTriggerProps): JSX.Element => {
  const [isOpen, setOpen] = useState(false)
  const onSuccessHandler = useCallback((): void => {
    setOpen(false)
    toast.info(`Area '${areaName}' deleted.`)
    if (onSuccess != null) {
      onSuccess()
    }
  }, [])
  return (
    <MobileDialog modal open={isOpen} onOpenChange={setOpen}>
      {children == null
        ? <DeleteAreaTriggerButtonDefault disabled={disabled} />
        : children}
      <DialogContent title='Delete area'>
        <DeleteAreaForm
          areaName={areaName}
          areaUuid={areaUuid}
          parentUuid={parentUuid}
          onSuccess={onSuccessHandler}
          returnToParentPageAfterDelete={returnToParentPageAfterDelete}
        />
      </DialogContent>
    </MobileDialog>
  )
}

export interface TriggerButtonProps {
  disabled: boolean
}

const DeleteAreaTriggerButtonDefault = ({ disabled }: TriggerButtonProps): JSX.Element => (
  <DialogTrigger
    className='btn btn-primary btn-sm btn-outline px-6'
    disabled={disabled}
    type='button'
  >
    Delete
  </DialogTrigger>
)

export const DeleteAreaTriggerButtonSm = ({ disabled }: TriggerButtonProps): JSX.Element => (
  <DialogTrigger
    className='btn btn-ghost btn-circle btn-primary'
    disabled={disabled}
    type='button'
  >
    <TrashIcon className='w-6 h-6' />
  </DialogTrigger>)

export type AddAreaTriggerProps = Omit<AddAreaFormProps, 'onError'> & { children?: JSX.Element}
/**
 * A button used to trigger the Add Area dialog.  See `DeleteAreaTrigger` for a customization example.
 */
export const AddAreaTrigger = ({ parentName, parentUuid, onSuccess, children }: AddAreaTriggerProps): JSX.Element => {
  const [hasChanges, setHasChanges] = useState(false)

  const onOpenChange = (isOpen: boolean): void => {
    if (!isOpen && hasChanges && onSuccess != null) {
      onSuccess()
    }
  }

  return (
    <MobileDialog modal onOpenChange={onOpenChange}>
      {children == null
        ? <AddAreaTriggerButtonCTA />
        : children}
      <DialogContent title='Add area'>
        <AddAreaForm
          parentName={parentName}
          parentUuid={parentUuid}
          onSuccess={() => setHasChanges(true)}
        />
      </DialogContent>
    </MobileDialog>
  )
}

const AddAreaTriggerButtonCTA = (): JSX.Element => (
  <DialogTrigger className='flex flex-row items-center gap-4'>
    <div className='border-secondary border-dashed border-2 w-16 h-16 rounded-box flex items-center justify-center'>
      <PlusIcon className='w-8 h-8 text-secondary' />
    </div>
    <div>Add New Area</div>
  </DialogTrigger>
)

export const AddAreaTriggerButtonMd = (): JSX.Element => (
  <DialogTrigger className='btn btn-sm btn-wide btn-outline btn-secondary border-dashed border-2 gap-2'>
    <PlusIcon className='stroke-2 w-5 h-5' /> New Area
  </DialogTrigger>
)

export const AddAreaTriggerButtonSm = (): JSX.Element => (
  <div className='tooltip' data-tip='Add new area'>
    <DialogTrigger className='btn btn-square btn-secondary btn-sm btn-ghost border-dashed border-2'>
      <PlusCircleIcon className='w-5 h-5 text-secondary' />
    </DialogTrigger>
  </div>)
