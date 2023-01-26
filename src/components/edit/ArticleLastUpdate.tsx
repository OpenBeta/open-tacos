import { useEffect, useState, FC } from 'react'
import { PencilIcon } from '@heroicons/react/24/outline'
import { EditMetadataType } from '../../js/types'
import { getUploadDateSummary } from '../../js/utils'
import { getUserNickFromMediaDir } from '../../js/usernameUtil'
import TreeIcon from '../../assets/icons/tree.svg'

export const ArticleLastUpdate: FC<EditMetadataType> = ({ updatedAt, updatedBy, createdAt, createdBy }) => {
  const [values, setValues] = useState<any>({
    updatedAtStr: '',
    createdAtStr: '',
    updatedByUid: 'Unknown',
    createdByUid: 'Unknown'
  })

  useEffect(() => {
    setValues({
      updatedAtStr: updatedAt != null ? getUploadDateSummary(new Date(updatedAt)) : '',
      createdAtStr: createdAt != null ? getUploadDateSummary(new Date(createdAt)) : ''
    })
    if (updatedBy != null) {
      void getUserNickFromMediaDir(updatedBy).then(value =>
        setValues(prev => ({ ...prev, updatedByUid: value }))
      )
    }
    if (createdBy != null) {
      void getUserNickFromMediaDir(createdBy).then(value =>
        setValues(prev => ({ ...prev, createdByUid: value }))
      )
    }
  }, [])
  const { updatedAtStr, createdAtStr, updatedByUid, createdByUid } = values
  return (
    <div className='mt-6 text-xs text-base-300 flex flex-col gap-3'>
      {createdAt != null &&
        <div className='flex items-center gap-2'>
          <span><TreeIcon className='h-5 w-5' /></span>
          <span><b>CREATED BY</b> {createdByUid} {createdAtStr}</span>
        </div>}
      {updatedAt != null &&
        <div className='flex items-center gap-2'>
          <PencilIcon className='h-4 w-4 mr-1' /><span><b>UPDATED BY</b>&nbsp;{updatedByUid}&nbsp;{updatedAtStr}</span>
        </div>}
    </div>
  )
}
