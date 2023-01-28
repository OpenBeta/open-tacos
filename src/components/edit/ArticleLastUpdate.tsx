import { useEffect, useState, FC } from 'react'
import Link from 'next/link'
import { PencilIcon } from '@heroicons/react/24/outline'
import { EditMetadataType } from '../../js/types'
import { getUploadDateSummary } from '../../js/utils'
import { getUserNickFromMediaDir } from '../../js/usernameUtil'
import TreeIcon from '../../assets/icons/tree.svg'

interface DisplayProps {
  updatedAtStr: string
  createdAtStr: string
  updatedByUid?: string
  createdByUid?: string
}
/**
 * Show created by and edit by.
 */
export const ArticleLastUpdate: FC<EditMetadataType> = ({ updatedAt, updatedBy, createdAt, createdBy }) => {
  const [values, setValues] = useState<DisplayProps>({
    updatedAtStr: '',
    createdAtStr: ''
  })

  /**
   * Since an area/climb page is generated server-side
   * useEffect is used to show updated timestamps each
   * time the browser displays the page.
   */
  useEffect(() => {
    if (updatedBy != null) {
      void getUserNickFromMediaDir(updatedBy).then(uid => {
        if (uid != null) setValues(prev => ({ ...prev, updatedByUid: uid }))
      }
      )
    }

    if (createdBy != null) {
      void getUserNickFromMediaDir(createdBy).then(uid => {
        if (uid != null) setValues(prev => ({ ...prev, createdByUid: uid }))
      }
      )
    }

    setValues(prev => ({
      ...prev,
      updatedAtStr: updatedAt != null ? getUploadDateSummary(new Date(updatedAt)) : '',
      createdAtStr: createdAt != null ? getUploadDateSummary(new Date(createdAt)) : ''
    }))
  }, [])

  const { updatedAtStr, createdAtStr, updatedByUid, createdByUid } = values
  return (
    <div className='flex flex-col gap-3 py-3 text-base-300 text-xs'>
      {createdAt != null &&
        <div className='flex items-center gap-2'>
          <TreeIcon className='h-5 w-5' />
          <span>
            <b>CREATED</b>{toUserProfile(createdByUid)}&nbsp;{createdAtStr}
          </span>
        </div>}
      {updatedAt != null &&
        <div className='flex items-center gap-2'>
          <PencilIcon className='h-4 w-4 mr-1' />
          <span>
            <b>UPDATED</b>{toUserProfile(updatedByUid)}&nbsp;{updatedAtStr}
          </span>
        </div>}
    </div>
  )
}

const toUserProfile = (uid?: string): JSX.Element | null => uid == null
  ? null
  : (
    <>
      <b>&nbsp;BY&nbsp;</b>
      <Link href={`/u/${uid}`}><a className='link-dotted'>{uid}</a></Link>
    </>
    )
