import React from 'react'
import Link from 'next/link'

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
            <div className='text-sm'>• July 2023: Photo upload is working again.  Known issue: you can only tag photos from your profile page.</div>
            <div className='text-sm'>
              • January 2023: Use this special&nbsp;
              <Link href='/crag/18c5dd5c-8186-50b6-8a60-ae2948c548d1'>
                <a className='link-dotted font-semibold'>
                  Test area
                </a>
              </Link>&nbsp;for test driving the new edit feature&nbsp;<a className='btn-link font-light text-xs' href='https://openbeta.substack.com/p/new-year-new-milestone'>Learn more</a>
            </div>

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
