import { useRef, useState, useEffect } from 'react'
import { MobileDialog, DialogContent, DialogTrigger } from '../ui/MobileDialog'
import AddChildAreaForm from './AddChildAreaForm'
import DeleteAreaForm from './DeleteAreaForm'

interface AreaEditActionTriggerProps {
  areaUuid: string
  areaName: string
  parentUuid: string
}
export default function AreaTrigger ({ areaName, areaUuid, parentUuid }: AreaEditActionTriggerProps): JSX.Element {
  const refDeleteTrigger = useRef()
  const [deleteButtonRef, setRef] = useState<any>()
  useEffect(() => {
    if (refDeleteTrigger?.current != null) {
      setRef(refDeleteTrigger)
    }
  }, [refDeleteTrigger])

  return (
    <div>
      <MobileDialog modal>
        <DialogTrigger className='btn btn-accent btn-xs'>
          Add new
        </DialogTrigger>
        <DialogContent title='Add new child area'>
          <AddChildAreaForm parentName={areaName} parentUuid={areaUuid} />
        </DialogContent>
      </MobileDialog>
      <MobileDialog modal>
        <DialogTrigger className='btn btn-accent btn-xs' ref={refDeleteTrigger}>
          Delete
        </DialogTrigger>
        <DialogContent title='Delete area'>
          <DeleteAreaForm
            areaName={areaName}
            areaUuid={areaUuid}
            parentUuid={parentUuid}
            closeButtonRef={deleteButtonRef}
          />
        </DialogContent>
      </MobileDialog>
    </div>
  )
}
