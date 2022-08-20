import { useSession } from 'next-auth/react'
import { actions } from '../../js/stores'
import { removePhoto } from '../../js/userApi/media'
import { MediaType } from '../../js/types'
import {
  AlertDialogContent,
  AlertDialog,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction
} from '../ui/micro/AlertDialogue'

interface RemoveImageProps {
  imageInfo: MediaType
  tagCount: Number
}

export default function RemoveImage ({ imageInfo, tagCount }: RemoveImageProps): JSX.Element | null {
  const { data } = useSession()

  const remove = async (): Promise<void> => {
    if (tagCount > 0) {
      // Additional safe-guard
      console.warn('## Error: Remove tags first')
      return
    }
    if (data?.user?.metadata == null) {
      console.warn('## Error: user metadata not found')
      return
    }

    const filename: string = imageInfo.filename
    const isRemoved = await removePhoto(filename)
    if (isRemoved != null) {
      await actions.media.removeImage(imageInfo.mediaId)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-10 w-10 md:w-8 md:h-8 md:marker:w-8 text-rose-100 bg-rose-500 ring-rose-500 hover:bg-rose-600
            hover:ring ring-offset-1 rounded-full p-1 transition'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
          </svg>
        </button>
      </AlertDialogTrigger>

      {tagCount === 0
        ? (
          <AlertDialogContent>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone...
            </AlertDialogDescription>

            <div className='flex w-full text-center'>
              <div className='flex-1'>
                <AlertDialogCancel asChild>
                  <button>
                    Cancel
                  </button>
                </AlertDialogCancel>
              </div>

              <div className='flex-1 whitespace-nowrap text-rose-500'>
                <AlertDialogAction asChild>
                  <button onClick={remove} className='flex items-center gap-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2}
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                    </svg>

                    Yes, delete photo
                  </button>
                </AlertDialogAction>
              </div>
            </div>
          </AlertDialogContent>
          )
        : (
          <AlertDialogContent>

            <AlertDialogTitle>There are still tags</AlertDialogTitle>
            <AlertDialogDescription>
              You need to delete tags from this photo before you can delete it
            </AlertDialogDescription>

            <div className='flex w-full text-center'>
              <div className='flex-1'>
                <AlertDialogCancel asChild>
                  <button>
                    Cancel
                  </button>
                </AlertDialogCancel>
              </div>
            </div>
          </AlertDialogContent>
          )}
    </AlertDialog>
  )
}
