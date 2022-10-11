import { userMediaStore } from '../../js/stores/media'
import { ErrorAlert } from '../contribs/alerts/Alerts'
import { AlertAction } from '../ui/micro/AlertDialogue'

interface PhotoUploadErrorMessageProps {
  photoUploadErrorMessage: string
}

const onClose = async (): Promise<void> => await userMediaStore.set.setPhotoUploadErrorMessage(null)

export const PhotoUploadError = ({ photoUploadErrorMessage }: PhotoUploadErrorMessageProps): JSX.Element => (
  <ErrorAlert description={photoUploadErrorMessage}>
    <AlertAction
      className='text-center p-2 border-2 rounded-xl border-ob-primary transition
                          text-ob-primary hover:bg-ob-primary hover:ring hover:ring-ob-primary ring-offset-2
                          hover:text-white w-1/6 font-bold'
      onClick={onClose}
    >
      Ok
    </AlertAction>
  </ErrorAlert>
)
