import { useRef, useState, useEffect } from 'react'
import { MobileDialog, DialogContent, DialogTrigger } from '../ui/MobileDialog'
import AddChildAreaForm from './AddChildAreaForm'
import DeleteAreaForm from './DeleteAreaForm'
import AreaEditForm from './AreaEditForm'
import { AreaType } from '../../js/types'

interface AreaEditActionTriggerProps extends AreaType {

}
export default function AreaTrigger (props: AreaEditActionTriggerProps): JSX.Element {
  const refDeleteTrigger = useRef()
  const [deleteButtonRef, setRef] = useState<any>()
  useEffect(() => {
    if (refDeleteTrigger?.current != null) {
      setRef(refDeleteTrigger)
    }
  }, [refDeleteTrigger])

  const { areaName, uuid, ancestors } = props
  const deletable = ancestors.length > 1
  return (
    <div>
      <MobileDialog modal>
        <DialogTrigger className='btn btn-accent btn-xs'>
          Add new
        </DialogTrigger>
        <DialogContent title='Add new child area'>
          <AddChildAreaForm parentName={areaName} parentUuid={uuid} />
        </DialogContent>
      </MobileDialog>
      <MobileDialog modal>
        <DialogTrigger className='btn btn-accent btn-xs' ref={refDeleteTrigger} disabled={!deletable}>
          Delete
        </DialogTrigger>
        <DialogContent title='Delete area'>
          <DeleteAreaForm
            areaName={areaName}
            areaUuid={uuid}
            parentUuid={ancestors[ancestors.length - 2]}
            closeButtonRef={deleteButtonRef}
          />
        </DialogContent>
      </MobileDialog>
      <MobileDialog modal>
        <DialogTrigger className='btn btn-accent btn-xs'>
          Edit
        </DialogTrigger>
        <DialogContent title='Edit area'>
          <AreaEditForm {...props} />
        </DialogContent>
      </MobileDialog>
    </div>
  )
}
