'use client'
import { useUserGalleryStore } from '@/js/stores/useUserGalleryStore'
import { LeanAlert } from '@/components/ui/micro/AlertDialogue'

export const BlockingAlertUploadingInProgress: React.FC = () => {
  const uploading = useUserGalleryStore(store => store.uploading)
  return uploading
    ? (
      <LeanAlert
        title='Uploading'
        description={<progress className='progress w-56' />}
      >
        <div />
      </LeanAlert>)
    : null
}
