'use client'
import { useState } from 'react'
import { Trash } from '@phosphor-icons/react/dist/ssr'

import { MobileDialog, DialogContent, DialogTrigger } from '@/components/ui/MobileDialog'
import DeleteAreaAndClimbForm from '@/components/edit/DeleteAreaAndClimbForm'

export const ClimbListMiniToolbar: React.FC<{ parentAreaId: string, climbId: string, climbName: string }> = ({ parentAreaId, climbId, climbName }) => {
  const [isOpen, setOpen] = useState(false)
  const onSuccessHandler = (): void => {
    setOpen(false)
  }

  return (
    <div className='flex justify-end mb-2 py-1'>
      <MobileDialog modal open={isOpen} onOpenChange={setOpen}>
        <DialogTrigger
          className='btn btn-xs btn-glass'
          type='button'
        >
          <Trash size={16} />Delete
        </DialogTrigger>
        <DialogContent title='Delete climb'>
          <DeleteAreaAndClimbForm
            name={climbName}
            uuid={climbId}
            parentUuid={parentAreaId}
            isClimb
            onSuccess={onSuccessHandler}
          />
        </DialogContent>
      </MobileDialog>
    </div>
  )
}
