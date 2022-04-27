import React from 'react'
import { Cc, By, Nc, Sa, Nd, Zero } from '../../../assets/icons/cc-icons'

import { OpenverseImage } from '.'

function LicenseIcons ({ image }: { image: OpenverseImage }): JSX.Element {
  const size = { width: 25, height: 25 }
  const getIcon = (license: string): JSX.Element => {
    switch (license.toUpperCase()) {
      case 'BY':
        return (<By {...size} />)
      case 'CC0':
        return (<><Cc {...size} /><Zero {...size} /></>)
      case 'BY-NC-ND':
        return (<><By {...size} /><Nc {...size} /><Nd {...size} /></>)
      case 'BY-SA':
        return (<><By {...size} /><Sa {...size} /></>)
      case 'BY-NC-SA':
        return (<><By {...size} /><Nc {...size} /><Sa {...size} /></>)
      default:
        return null
    }
  }
  return (
    <div
      onClick={() => {
        window.open(image.license_url, '_blank')
        return false
      }} className='absolute right-0 bottom-0 block flex flex-row-reverse m-2'
    >
      {getIcon(image.license)}
    </div>
  )
}

export default LicenseIcons
