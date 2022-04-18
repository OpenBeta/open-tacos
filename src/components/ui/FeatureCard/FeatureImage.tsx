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
    <div
      style={{ backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url('${image.url}')` }}
      className='aspect-[4/3] overflow-hidden items-end flex flex-col-reverse'
      data-tooltip={image.attribution}
    >
      <LicenseIcons image={image} />
    </div>
  )
}
