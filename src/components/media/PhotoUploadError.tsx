import { XIcon } from '@heroicons/react/outline'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { userMediaStore } from '../../js/stores/media'

interface PhotoUploadErrorMessageProps {
  photoUploadErrorMessage: string
}

export const PhotoUploadError = ({ photoUploadErrorMessage }: PhotoUploadErrorMessageProps): JSX.Element => (
  <AlertDialogPrimitive.Root defaultOpen>
    <Content>
      <AlertDialogPrimitive.Action asChild>
        <div className='flex justify-end mt-2'>
          <button
            type='button'
            className='bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            onClick={() => {
              console.log('clicked x')
            }}
          >
            <span className='sr-only'>Close</span>
            <XIcon className='h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400' aria-hidden='true' />
          </button>
        </div>
      </AlertDialogPrimitive.Action>
      <AlertDialogPrimitive.Title className='text-lg font-medium'>
        Photo upload error
      </AlertDialogPrimitive.Title>
      <AlertDialogPrimitive.Description className='text-md text-gray-700'>
        {photoUploadErrorMessage}
      </AlertDialogPrimitive.Description>
      <div className='flex justify-end mt-2'>
        <AlertDialogPrimitive.Action asChild>
          <button
            type='button'
            onClick={async () => await userMediaStore.set.setPhotoUploadErrorMessage(null)}
            className='text-center p-2 border-2 rounded-xl border-ob-primary transition
                          text-ob-primary hover:bg-ob-primary hover:ring hover:ring-ob-primary ring-offset-2
                          hover:text-white w-1/6 font-bold'
          >
            Ok
          </button>
        </AlertDialogPrimitive.Action>
      </div>
    </Content>
  </AlertDialogPrimitive.Root>
)

const Content: React.FC<{ children: React.ReactNode }> = ({ children, ...props }: { children: JSX.Element }) => {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay className='fixed bg-black bg-opacity-30 inset-0 z-40' />
      <AlertDialogPrimitive.Content
        className='animate-fade-in-out shadow-lg z-50 bg-white w-[90vw] rounded-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-lg max-h-[85vh] p-4'
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Portal>
  )
}
