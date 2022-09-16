import { MobileDialog, DialogContent, DialogTrigger } from '../ui/MobileScreen'

export default function AreaTrigger (): JSX.Element {
  return (
    <div>
      <MobileDialog>
        <DialogTrigger asChild>
          <button type='button' className='btn btn-primary btn-xs'>Edit</button>
        </DialogTrigger>
        <DialogContent>Dialog Content</DialogContent>
      </MobileDialog>
    </div>
  )
}
