import { useSession } from 'next-auth/react'

import { MediaWithTags } from '../../js/types'
import AlertDialogue from '../ui/micro/AlertDialogue'
import { DefaultLoader } from '../../js/sirv/util'
import useMediaCmd from '../../js/hooks/useMediaCmd'

interface RemoveImageProps {
  imageInfo: MediaWithTags
}

export default function RemoveImage ({ imageInfo }: RemoveImageProps): JSX.Element | null {
  const session = useSession()
  const { deleteOneMediaObjectCmd } = useMediaCmd()

  const { entityTags } = imageInfo
  if (entityTags.length > 0) return null

  const remove = (): void => {
    void deleteOneMediaObjectCmd(imageInfo.id, imageInfo.mediaUrl, session.data?.accessToken)
  }

  return (
    <AlertDialogue
      onConfirm={remove}
      hideTitle
      button={(
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
        </button>)}
    >
      <div className='flex items-center justify-center p-4'>
        <div className='rounded-xl overflow-hidden shadow'>
          <img
            src={DefaultLoader({ src: imageInfo.mediaUrl, width: 200 })}
            width={1200}
            sizes='100vw'
            className='bg-gray-100 w-auto h-[100%] max-h-[700px]'
          />
        </div>
      </div>

      <div className='text-center'>
        Delete photo?
        <div className='text-rose-600 font-bold text-lg'>
          This cannot be undone
        </div>
      </div>
    </AlertDialogue>
  )
}
