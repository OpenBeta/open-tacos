import Image from 'next/legacy/image'
import { PhotoIcon } from '@heroicons/react/24/outline'
import { OpenverseImage } from '.'

export function DefaultImage (): JSX.Element {
  return (
    <div
      style={{ backgroundRepeat: 'no-repeat', backgroundSize: '35%', backgroundPosition: 'center', backgroundImage: 'url("tortilla.png")' }}
      className='aspect-[4/3] overflow-hidden items-end flex flex-col-reverse'
    />
  )
}

export function FeatureImage ({ image }: { image: OpenverseImage }): JSX.Element {
  return (
    <div className='relative block'>
      <div
        className='z-0 aspect-[4/3] overflow-hidden block relative'
      >{image.url == null
        ? (
          <div className='bg-contrast h-full flex flex-cols items-center justify-center'>
            <div><PhotoIcon className='stroke-1 stroke-gray-400 w-12 h-12' /></div>
          </div>
          )
        : <Image
            src={image.url}
            alt=''
            objectFit='cover'
            objectPosition='center'
            layout='fill'
            priority={false}
          />}
      </div>
    </div>
  )
}
