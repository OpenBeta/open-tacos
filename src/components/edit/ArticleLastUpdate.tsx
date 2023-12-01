'use client'
import { useEffect, useState, FC } from 'react'
import Link from 'next/link'
import { AuthorMetadata } from '../../js/types'
import { getUploadDateSummary } from '../../js/utils'
import { Plant, PersonArmsSpread } from '@phosphor-icons/react/dist/ssr'

interface DisplayProps {
  updatedAtStr: string
  createdAtStr: string
  updatedByUser?: string
  createdByUser?: string
}
/**
 * Show created by and edit by.
 */
export const ArticleLastUpdate: FC<AuthorMetadata> = ({ updatedAt, updatedByUser, createdAt, createdByUser }) => {
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
    setValues(prev => ({
      ...prev,
      updatedAtStr: updatedAt != null ? getUploadDateSummary(updatedAt) : '',
      createdAtStr: createdAt != null ? getUploadDateSummary(createdAt) : ''
    }))
  }, [])

  const { updatedAtStr, createdAtStr } = values
  return (
    <div className='flex flex-col gap-3 py-3 text-base-300 text-xs'>
      {createdAt != null &&
        <div className='flex items-center gap-2'>
          <Plant size={20} />
          <span>
            <b>CREATED</b>{toUserProfile(createdByUser)}&nbsp;{createdAtStr}
          </span>
        </div>}
      {updatedAt != null &&
        <div className='flex items-center gap-2'>
          <PersonArmsSpread size={20} />
          <span>
            <b>UPDATED</b>{toUserProfile(updatedByUser)}&nbsp;{updatedAtStr}
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
      <Link href={`/u/${uid}`} className='link-dotted'>{uid}</Link>
    </>
    )
