import Image from 'next/image'

import { OpenverseImage } from '.'
import LicenseIcons from './LicenseIcons'

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
        data-tooltip={image.attribution}
      >
        <Image
          src={image.url}
          alt=''
          objectFit='cover'
          objectPosition='center'
          layout='fill'
          priority
        />
      </div>
      <LicenseIcons image={image} />
    </div>

  )
}
