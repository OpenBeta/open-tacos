import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import ClimbSearch from './search/ClimbSearch'

import { TextButton } from './ui/Button'
import MobileTableAppBar from './MobileAppBar'
import { FilterBar } from './finder/filters'

export default function Header () {
  const router = useRouter()
  const isIndexPage = router.pathname === '/'

  // track expand/collapse of search widget (for large screen only)
  const [expanded, setExpanded] = useState(isIndexPage)

  const controlDirection = useCallback(() => {
    if (typeof window !== 'undefined' && window.scrollY < 150 && isIndexPage) {
      setExpanded(true)
    } else {
      setExpanded(false)
    }
  }, [isIndexPage])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.addEventListener('scroll', controlDirection)
    return () => {
      window.removeEventListener('scroll', controlDirection)
    }
  }, [])

  const onClick = () => setExpanded(!expanded)
  const onClickOutside = () => setExpanded(false)

  return (
    <>
      <MobileTableAppBar />
      <header
        className={`hidden lg:block lg:fixed lg:top-0 h-16 z-50 w-full px-4 py-4 lg:py-2 max-w-screen-2xl mx-auto bg-gray-800 transition duration-300 ease-in-out ${expanded ? 'h-36' : ''}`}
      >
        <nav className='z-50 flex items-center justify-between w-full'>
          <a href='/' className='inline-flex flex-rows justify-start items-center md:gap-x-2'>
            <Image className='align-middle' src='/tortilla.png' height={32} width={32} />
            <span className='hidden md:inline-flex items-center font-semibold text-xl lg:text-2xl text-custom-primary pt-1'>OpenTacos</span>
          </a>
          {/* Large screens only: show search widget */}
          <ClimbSearch
            expanded={expanded}
            onClick={onClick}
            onClickOutside={onClickOutside}
          />
          <div className='flex items-center gap-x-4'>
            {navList.map(item => <NavItem key={item.title} {...item} />)}
          </div>
        </nav>
      </header>
      <FilterBar />
    </>
  )
}

const NavItem = ({ route, title, cta }) => {
  return (
    <TextButton
      className={`btn-small lg:btn-medium ${cta ? 'btn-nav-secondary' : 'btn-nav'}`} label={title} to={route}
    />
  )
}

const navList = [
  {
    route: '/about',
    title: 'About'
  },
  {
    route: 'https://docs.openbeta.io',
    title: 'Docs'
  },
  {
    route: 'https://discord.gg/2A2F6kUtyh',
    title: 'Discord',
    cta: true
  }
]

/**
 * Important:
 * This value defines the actual height of the header.
 * Map div uses absolute positioning and relies on the value to set
 * its top-${NAV_BAR_OFFSET}px
 * Todo: caclculate this value programmatically
 */
export const NAV_BAR_OFFSET = 112 // px
