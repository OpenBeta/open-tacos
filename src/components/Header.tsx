import React from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'

import MobileTabletAppBar from './MobileAppBar'
import DesktopAppBar from './DesktopAppBar'
import useResponsive from '../js/hooks/useResponsive'
import PhotoUploadError from './media/PhotoUploadError'
import { userMediaStore } from '../js/stores/media'
import AppAlert from './broadcast/AppAlert'

const NAV_BAR_IDENTIFIER = 'tacos-nav-bar'

interface HeaderProps {
  showFilterBar?: boolean
}

export default function Header (props: HeaderProps): JSX.Element {
  const { isTablet, isMobile } = useResponsive()
  const includeFilters = Boolean(props.showFilterBar)
  const photoUploadErrorMessage = userMediaStore.use.photoUploadErrorMessage()
  const isPhotoError = photoUploadErrorMessage !== null

  return (
    <>
      {isPhotoError && <PhotoUploadError photoUploadErrorMessage={photoUploadErrorMessage} />}
      <div id={NAV_BAR_IDENTIFIER} className='relative z-40'>
        {isTablet || isMobile
          ? <MobileTabletAppBar isTablet={isTablet} includeFilters={includeFilters} />
          : <DesktopAppBar
              showFilterBar={includeFilters}
            />}
      </div>
      <AppAlert
        message={
          <>
            <ExclamationTriangleIcon className='h-5 w-5 inline-block' /> Test mode alert!  Data may be inaccurate.  Consult guidebooks & local community for latest conditions.
            &nbsp;<a className='btn btn-xs font-light' href='https://openbeta.substack.com/p/beta-testers-wanted'>Learn more</a>
          </>
        }
      />
    </>
  )
}

export const getNavBarOffset = (): number => {
  if (typeof document === 'undefined') {
    return 0
  }

  return document.getElementById(NAV_BAR_IDENTIFIER)?.offsetHeight ?? 0
}
