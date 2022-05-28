import Image from 'next/image'
import { MediaTag } from '../../js/types'
import { SIRV_CONFIG } from '../../js/sirv/SirvClient'

interface PhotoMontageProps {
  photoList: MediaTag[]
}
export default function PhotoMontage ({ photoList }: PhotoMontageProps): JSX.Element {
  if (photoList.length <= 2) {
    return (
      <div className='flex'>{photoList.map(({ mediaUrl, mediaUuid }) => {
        const imgUrl = `${SIRV_CONFIG.baseUrl ?? ''}${mediaUrl}?format=webp&h=350&q=90`
        return (
          <div key={mediaUuid}>
            <Image src={imgUrl} width={300} height={300} />
          </div>
        )
      })}
      </div>
    )
  }
  const first = `${SIRV_CONFIG.baseUrl ?? ''}${photoList[0].mediaUrl}?format=webp&h=364&q=90`
  return (
    <div className='grid grid-cols-4 grid-flow-row-dense gap-1 rounded-xl overflow-hidden'>
      <div className='block relative col-start-1 col-span-2 row-span-2 col-end-3 bg-blue-200'>
        <Image src={first} height={364} width={364} layout='fill' sizes='50vw' objectFit='cover' quality={100} />
      </div>
      {photoList.slice(1, 5).map(({ mediaUrl, mediaUuid }) => {
        const imgUrl = `${SIRV_CONFIG.baseUrl ?? ''}${mediaUrl}?format=webp&&thumbnail=180&q=90`
        return (
          <div key={mediaUuid} className='block relative w-[180px] h-[180px]'>
            <Image src={imgUrl} width={180} height={180} quality={100} layout='fill' sizes='50vw' objectFit='cover' />
          </div>
        )
      })}

    </div>
  )
}

// <div className='flex rounded-xl overflow-hidden gap-1 border-2'>
// <div className='w-[350px] h-[350px]'>
//   <Image src={first} height={350} width={350} />
// </div>
// <div className='grid grid-cols-2 grid-flow-row gap-1'>
//   {photoList.slice(1, 5).map(({ mediaUrl, mediaUuid }) => {
//     const imgUrl = `${SIRV_CONFIG.baseUrl ?? ''}${mediaUrl}?format=webp&&thumbnail=172&q=90`
//     return (
//       <div key={mediaUuid} className='aspect-square overflow-hidden'>
//         <Image src={imgUrl} width={173} height={173} />
//       </div>
//     )
//   })}
// </div>

// </div>
