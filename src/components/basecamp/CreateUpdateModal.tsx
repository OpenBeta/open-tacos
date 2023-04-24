import { MobileDialog, DialogContent } from '../ui/MobileDialog'
import { ReactElement } from 'react'

import { Button, ButtonVariant } from '../ui/BaseButton'

interface CreateUpdateModalProps {
  isOpen: boolean
  setOpen: (arg0: boolean) => void
  contentContainer: ReactElement
}

/**
 * Modal for creating and updating objects (areas, organizations, etc) in our datastores.
 */
export default function CreateUpdateModal ({
  isOpen,
  setOpen,
  contentContainer
}: CreateUpdateModalProps): JSX.Element {
  return (
    <MobileDialog
      modal
      open={isOpen}
      onOpenChange={setOpen}
    >
      <DialogContent onInteractOutside={() => setOpen(false)}>
          {contentContainer}
      </DialogContent>
    </MobileDialog>
  )
}
