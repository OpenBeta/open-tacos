import Image from 'next/image'
import { MediaTag } from '../../js/types'
import { SIRV_CONFIG } from '../../js/sirv/SirvClient'
import useResponsive from '../../js/hooks/useResponsive'
import { shuffle } from 'underscore'
interface PhotoMontageProps {
  photoList: MediaTag[]
}
export default function PhotoMontage ({ photoList }: PhotoMontageProps): JSX.Element | null {
  const { isMobile } = useResponsive()

  if (photoList == null || photoList?.length === 0) { return null }

  if (isMobile) {
    const first = `${SIRV_CONFIG.baseUrl ?? ''}${photoList[0].mediaUrl}?format=webp&w=650&q=90`
    return (
      <div className='block relative w-full h-60'>
        <Image src={first} layout='fill' sizes='100vw' objectFit='cover' quality={100} />
      </div>
    )
  }

  if (photoList.length <= 4) {
    return (
      <div className='grid grid-cols-2 grid-flow-row-dense gap-1 rounded-xl overflow-hidden w-full h-80'>
        {photoList.slice(0, 4).map(({ mediaUrl, mediaUuid }) => {
          const imgUrl = `${SIRV_CONFIG.baseUrl ?? ''}${mediaUrl}?format=webp&h=364&q=90`
          return (
            <div key={mediaUuid} className='block relative'>
              <Image src={imgUrl} layout='fill' sizes='50vw' objectFit='cover' quality={100} />
            </div>
          )
        })}
      </div>
    )
  }

  const newList = shuffle(photoList)
  const first = `${SIRV_CONFIG.baseUrl ?? ''}${newList[0].mediaUrl}?format=webp&h=320&q=90`
  return (
    <div className='grid grid-cols-4 grid-flow-row-dense gap-1 rounded-xl overflow-hidden w-full h-80'>
      <div className='block relative col-start-1 col-span-2 row-span-2 col-end-3'>
        <Image src={first} layout='fill' sizes='50vw' objectFit='cover' quality={100} />
      </div>
      {newList.slice(1, 5).map(({ mediaUrl, mediaUuid }) => {
        const imgUrl = `${SIRV_CONFIG.baseUrl ?? ''}${mediaUrl}?format=webp&&thumbnail=158&q=90`
        return (
          <div key={mediaUuid} className='block relative'>
            <Image src={imgUrl} quality={100} layout='fill' sizes='50vw' objectFit='cover' />
          </div>
        )
      })}

    </div>
  )
}
