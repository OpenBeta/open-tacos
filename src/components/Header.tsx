import React from 'react'
import Link from 'next/link'
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
            We created a special
            <Link href='/crag/18c5dd5c-8186-50b6-8a60-ae2948c548d1'>
              <a className='semibold underline'>
                Test area
              </a>
            </Link>for test driving the new edit feature.
            &nbsp;<a className='btn btn-xs font-light' href='https://openbeta.substack.com/p/new-year-new-milestone'>Learn more</a>
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
