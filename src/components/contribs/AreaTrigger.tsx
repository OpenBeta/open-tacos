import { MobileDialog, DialogContent, DialogTrigger } from '../ui/MobileDialog'
import AddChildAreaForm, { ChildAreaBaseProps } from './AddChildAreaForm'
import DeleteAreaForm from './DeleteAreaForm'
export default function AreaTrigger (props: ChildAreaBaseProps): JSX.Element {
  return (
    <div>
      <MobileDialog modal>
        <DialogTrigger className='btn btn-accent btn-xs'>
          Add new
        </DialogTrigger>
        <DialogContent title='Add new child area'>
          <AddChildAreaForm {...props} />
        </DialogContent>
      </MobileDialog>
      <MobileDialog modal>
        <DialogTrigger className='btn btn-accent btn-xs'>
          Delete
        </DialogTrigger>
        <DialogContent title='Delete area'>
          <DeleteAreaForm areaName={props.parentName} areaUuid={props.parentUuid} />
        </DialogContent>
      </MobileDialog>
    </div>
  )
}
