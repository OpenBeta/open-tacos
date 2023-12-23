'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Trash } from '@phosphor-icons/react/dist/ssr'
import useUpdateClimbsCmd from '@/js/hooks/useUpdateClimbsCmd'
import Confirmation from '@/components/ui/micro/AlertDialogue'

export const ClimbListMiniToolbar: React.FC<{ parentAreaId: string, climbId: string, climbName: string }> = ({ parentAreaId, climbId, climbName }) => {
  const session = useSession({ required: true })
  const router = useRouter()
  const { deleteClimbsCmd } = useUpdateClimbsCmd({ parentId: parentAreaId, accessToken: session.data?.accessToken ?? '' })
  const onConfirm = (): void => {
    deleteClimbsCmd([climbId]).then((count) => {
      router.refresh()
    }).catch((error) => {
      console.error(error)
    })
  }
  return (
    <div className='flex justify-end mb-2 py-1'>
      <Confirmation
        title='Please confirm'
        confirmText='Delete'
        button={
          <button className='btn btn-xs btn-glass'>
            <Trash size={16} /> Delete
          </button>
        }
        onConfirm={onConfirm}
      >
        You're about to delete climb "<i>{climbName}"</i>. <strong>This cannot be undone.</strong>
      </Confirmation>
    </div>
  )
}
