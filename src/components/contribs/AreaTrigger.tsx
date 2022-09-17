import { MobileDialog, DialogContent, DialogTrigger } from '../ui/MobileScreen'
import AddChildAreaForm, { ChildAreaBaseProps } from './AddChildAreaForm'

export default function AreaTrigger (props: ChildAreaBaseProps): JSX.Element {
  return (
    <div>
      <MobileDialog>
        <DialogTrigger asChild>
          <button type='button' className='btn btn-primary btn-xs'>Edit</button>
        </DialogTrigger>
        <DialogContent title='Add new child area'>
          <AddChildAreaForm {...props} />
        </DialogContent>
      </MobileDialog>
    </div>
  )
}
