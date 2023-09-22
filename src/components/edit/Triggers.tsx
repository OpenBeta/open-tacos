import { useState, useCallback } from 'react'
import { PlusIcon, PlusCircleIcon } from '@heroicons/react/20/solid'
import { TrashIcon } from '@heroicons/react/24/outline'
import { MobileDialog, DialogContent, DialogTrigger } from '../ui/MobileDialog'
import DeleteAreaForm, { DeleteAreaProps } from './DeleteAreaForm'
import AddAreaForm, { AddAreaFormProps } from './AddChildAreaForm'
import { toast } from 'react-toastify'
import Tooltip from '../ui/Tooltip'

export type DeleteAreaTriggerProps = DeleteAreaProps & {
  disabled?: boolean
  children?: JSX.Element }

/**
 * A high level component that triggers the Delete Area dialog.  You can pass an optional nested component to customize the look and feel of the trigger button.
 *
 * Example:
 * ```
 * <DeleteAreaTrigger>
 *   <DeleteAreaTriggerButtonSm disabled={!canEdit}/>
 * </DeleteAreaTrigger>
 * ```
 * @param areaName j
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

/**
 * A small delete trigger button
 */
export const DeleteAreaTriggerButtonSm = ({ disabled }: TriggerButtonProps): JSX.Element => (
  disabled
    ? (
      <Tooltip
        content='Please delete child areas or climbs first.' enabled={disabled}
      >
        <div className='btn btn-ghost btn-circle btn-primary btn-disabled'>
          <TrashIcon className='w-6 h-6' />
        </div>
      </Tooltip>)
    : (
      <DialogTrigger
        data-no-dnd='true'
        className='z-50 btn btn-ghost btn-circle btn-accent'
        disabled={disabled}
        type='button'
      >
        <TrashIcon className='w-6 h-6' />
      </DialogTrigger>)

)

export type AddAreaTriggerProps = Omit<AddAreaFormProps, 'onError'> & { children?: JSX.Element }

/**
 * A high level component that triggers the Add Area dialog.  See  {@link DeleteAreaTrigger} for a customization example.
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

/**
 * Default trigger button
 */
const AddAreaTriggerButtonCTA = (): JSX.Element => (
  <DialogTrigger className='flex flex-row items-center gap-4'>
    <div className='border-secondary border-dashed border-4 w-24 h-24 hover:bg-secondary hover:bg-opacity-60 rounded-box flex items-center justify-center'>
      <PlusIcon className='w-8 h-8 text-secondary' />
    </div>
    <div>Add New Area</div>
  </DialogTrigger>
)

export const AddAreaTriggerButtonMd = (): JSX.Element => (
  <DialogTrigger data-no-dnd='true' className='btn btn-sm w-full md:btn-wide btn-solid btn-secondary border-dashed border-2 gap-2'>
    <PlusIcon className='stroke-2 w-5 h-5' data-no-dnd='true' /> New Area
  </DialogTrigger>
)

export const AddAreaTriggerButtonSm = (): JSX.Element => (
  <DialogTrigger className='btn btn-square btn-sm btn-ghost'>
    <PlusCircleIcon className='w-6 h-6 text-base-content/80' />
  </DialogTrigger>
)
