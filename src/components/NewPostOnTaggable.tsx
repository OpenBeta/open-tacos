import { useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { PlusIcon, DotsHorizontalIcon } from '@heroicons/react/solid'

import usePhotoUploader from '../js/hooks/usePhotoUploader'
import { Button, ButtonVariant } from './ui/BaseButton'
import { userMediaStore } from '../js/stores/media'
import { MediaBaseTag } from '../js/types'
import { useMutation } from '@apollo/client'
import { graphqlClient } from '../js/graphql/Client'
import { MUTATION_ADD_AREA_TAG_TO_MEDIA, MUTATION_ADD_CLIMB_TAG_TO_MEDIA } from '../js/graphql/fragments'

interface NewPostOnTaggableProps {
  isMobile?: boolean
  areaId?: string
  climbId?: string
  /**
   * You can optionally override the rendered button content by composing
   * it as a child of this component.
   */
  children?: any

  onTagAdded?: (tags: MediaBaseTag) => void
}

const MobileButton = (props: {uploading: boolean}): JSX.Element => (
  <Button
    disabled={props.uploading}
    label={
      <span className='border-2 text-white rounded-md border-white'>
        {props.uploading ? <DotsHorizontalIcon className='w-6 h-6' /> : <PlusIcon className='w-6 h-6' />}
      </span>
                }
  />
)

const DefaultButton = (props: {uploading: boolean}): JSX.Element => (
  <Button
    disabled={props.uploading}
    label={
      <div className='flex no-wrap items-center space-x-2 px-4'>
        {props.uploading
          ? <DotsHorizontalIcon className='w-5 h-5 stroke-white stroke-2 animate-pulse' />
          : <PlusIcon className='stroke-white stroke-2 w-5 h-5' />}
        <span className='mt-0.5 px-2'>Photo</span>
      </div>
          }
    variant={ButtonVariant.SOLID_PRIMARY}
  />
)

/**
 * Button allowing users to upload a photo and immediately tag it with the current area or climb
 * that the button is contextually linked to.
 */
export default function NewPostOnTaggable (props: NewPostOnTaggableProps): JSX.Element | null {
  const [tagPhotoWithClimb] = useMutation(
    MUTATION_ADD_CLIMB_TAG_TO_MEDIA, {
      client: graphqlClient,
      errorPolicy: 'none',
      onCompleted: (d: any) => {
        console.log(d)
        if (props.onTagAdded !== undefined) {
          props.onTagAdded(d.setTag)
        }
      }
    }

  )
  const [tagPhotoWithArea] = useMutation(
    MUTATION_ADD_AREA_TAG_TO_MEDIA, {
      client: graphqlClient,
      errorPolicy: 'none',
      onCompleted: (d: any) => {
        console.log(d)
        if (props.onTagAdded !== undefined) {
          props.onTagAdded(d.setTag)
        }
      }
    }
  )

  const { status, data } = useSession()

  const onUploaded = useCallback(async (url: string): Promise<void> => {
    if (data?.user?.metadata == null) {
      console.log('## Error: user metadata not found')
      return
    }

    const { nick, uuid } = data.user.metadata

    if (uuid != null && nick != null) {
      const imageInfo = await userMediaStore.set.addImage(nick, uuid, url, true)

      if (imageInfo === undefined) {
        console.error('No image info returned from addImage')
        return
      }

      for (const imi of imageInfo) {
        if (props.climbId !== undefined) {
          await tagPhotoWithClimb({
            variables: {
              mediaUuid: imi.mediaId,
              mediaUrl: imi.filename,
              srcUuid: props.climbId
            }
          })
        }

        // Note that the back end does not support area tagging at the time of committing
        if (props.areaId !== undefined) {
          await tagPhotoWithArea({
            variables: {
              mediaUuid: imi.mediaId,
              mediaUrl: imi.filename,
              srcUuid: props.areaId
            }
          })
        }
      }
    }
  }, [])

  const { uploading, getRootProps, getInputProps } = usePhotoUploader({ onUploaded })

  const Default = props.isMobile === true ? MobileButton : DefaultButton

  if (status === 'authenticated') {
    return (
      <>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {props.children !== undefined
            ? (
              <button
                className='w-full'
                disabled={uploading}
              >
                {
                uploading
                  ? 'uploading files...'
                  : props.children
                }
              </button>
              )
            : <Default uploading={uploading} />}
        </div>
      </>
    )
  }

  return null
}
