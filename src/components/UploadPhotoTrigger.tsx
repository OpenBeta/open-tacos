import { useRef } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter, NextRouter } from 'next/router'
import { validate as isValidUuid } from 'uuid'
import clx from 'classnames'

import usePhotoUploader from '../js/hooks/usePhotoUploader'
import { userMediaStore, revalidateUserHomePage } from '../js/stores/media'
import useReturnToProfile from '../js/hooks/useReturnToProfile'
import usePhotoTag from '../js/hooks/usePhotoTagCmd'
import { mediaUrlHash } from '../js/sirv/SirvClient'
import { BlockingAlert } from './ui/micro/AlertDialogue'

interface UploadPhotoTriggerProps {
  children: JSX.Element | JSX.Element []
  className?: string
  onUploaded?: () => void
}

/**
 * Wrapper component that uploads photo to our image provider.
 * If the user is viewing a climb or an area page, also tag
 * the climb/area.
 */
export default function UploadPhotoTrigger ({ className = '', onUploaded, children }: UploadPhotoTriggerProps): JSX.Element | null {
  const { data, status } = useSession()
  const router = useRouter()

  /**
   * Why useRef?
   * Even though render is called multiple times, the callback function is
   * only generated once, with a stale session object.
   * See https://stackoverflow.com/questions/57847594/react-hooks-accessing-up-to-date-state-from-within-a-callback
  */
  const sessionRef = useRef<any>()
  sessionRef.current = data?.user

  const { tagPhotoCmd } = usePhotoTag()
  const { toMyProfile } = useReturnToProfile()

  const onUploadedHannder = async (url: string): Promise<void> => {
    const session = sessionRef.current

    if (session.metadata == null) {
      console.log('## Error: user metadata not found')
      return
    }

    const { nick, uuid } = session.metadata

    const [id, destType, pageToInvalidate, destPageUrl] = pagePathToEntityType(router)

    // let's see if we're viewing the climb or area page
    if (id != null && isValidUuid(id) && (destType === 0 || destType === 1)) {
      // yes! let's tag it
      await tagPhotoCmd({
        mediaUrl: url,
        mediaUuid: mediaUrlHash(url),
        destinationId: id,
        destType
      })

      if (onUploaded != null) onUploaded()

      // Tell Next to regenerate the page being tagged
      try {
        await fetch(pageToInvalidate)
      } catch (e) { console.log(e) }

      // Regenerate user profile page as well
      if (nick != null) {
        void revalidateUserHomePage(nick)
      }

      // Very important call to force destination page to update its props
      // without doing a hard refresh
      void router.replace(destPageUrl)
    } else {
      if (uuid != null && nick != null) {
        await toMyProfile()
        await userMediaStore.set.addImage(nick, uuid, url, true)
      }
    }
  }

  const { uploading, getRootProps, getInputProps, openFileDialog } = usePhotoUploader({ onUploaded: onUploadedHannder })

  return (
    <div
      className={clx('pointer-events-none cursor-not-allowed', className, uploading ? 'pointer-events-none' : '')} {...getRootProps()} onClick={(e) => {
        if (status === 'authenticated' && !uploading) {
          openFileDialog()
        } else {
          void signIn('auth0')
        }
      }}
    >
      <input {...getInputProps()} />
      {children}
      {uploading &&
        <BlockingAlert
          title='Uploading'
          description={<progress className='progress w-56' />}
        />}
    </div>
  )
}

/**
 * Convert current page path to a destination type for tagging.  Expect `path` to be in /areas|crag|climb/[id].
 * @param path `path` property as return from `Next.router()`
 */
const pagePathToEntityType = (router: NextRouter): [string, number, string, string] | [null, null, null, null] => {
  const nulls: [null, null, null, null] = [null, null, null, null]
  const { asPath, query } = router
  const tokens = asPath.split('/')

  if (query == null || query.id == null || tokens.length < 3) return nulls

  const id = query.id as string
  switch (tokens[1]) {
    case 'climbs':
      return [id, 0, `/api/revalidate?c=${id}`, `/climbs/${id}`]
    case 'areas':
      return [id, 1, `/api/revalidate?s=${id}`, `/crag/${id}?${Date.now()}`]
    case 'crag':
      return [id, 1, `/api/revalidate?s=${id}`, `/crag/${id}?${Date.now()}`]
    default:
      return nulls
  }
}
