import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.js'
import ClimbSearch from './search/ClimbSearch'
import { ClimbSearchByName } from './search/ClimbSearchByName'
import CragFilters from './finder/filters'

import { TextButton } from './ui/Button'

const fullConfig = resolveConfig(tailwindConfig)

const parseTailwindScreenValue = (w) => w.slice(0, w.indexOf('px'))

function Header () {
  const router = useRouter()
  // track position of scrollbar
  const [direction, setDirection] = useState('top')

  // track expand/collapse of search widget (for large screen only)
  const [expanded, setExpanded] = useState(false)

  const controlDirection = () => {
    if (window.scrollY > 80) {
      setExpanded(false)
    }
    if (window.scrollY > 280) {
      setDirection('down')
    } else {
      setDirection('top')
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', controlDirection)
    return () => {
      window.removeEventListener('scroll', controlDirection)
    }
  }, [])

  useEffect(() => {
    const isLargeScreen = window.innerWidth >= parseTailwindScreenValue(fullConfig.theme.screens.lg)
    if (isIndexPage && isLargeScreen) { setExpanded(direction === 'top') }
  }, [direction])

  const onClick = () => setExpanded(!expanded)
  const onClickOutside = () => setExpanded(false)

  const isIndexPage = router.pathname === '/'
  return (
    // Mobile: to be scrolled up
    // Large screens: fixed, collapsed as users scroll page or click outside of navbar
    // ${direction === 'down' || !isIndexPage ? 'bg-gray-800' : ''}
    <header
      className={`lg:fixed lg:top-0 z-50 w-full px-4 py-4 lg:py-2 max-w-screen-2xl mx-auto bg-gray-800 transition duration-300 ease-in-out ${expanded ? 'h-36' : ''} ${isIndexPage && expanded && window.scrollY < 80 ? 'bg-opacity-30' : ''}`}
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
      {router.pathname === '/finder' && <CragFilters />}
      {/* Mobile only: Sticky search bar to appear as users scroll */}
      <div className='lg:hidden w-full'>
        {!isIndexPage && <div className='pt-8 w-full'><ClimbSearchByName placeholder='"Levitation 29" or "technical crimpy"' /></div>}
        {direction === 'down' && <div className='fixed top-0 left-0 bg-gray-800 px-2 py-2 w-full'><ClimbSearchByName placeholder='"Levitation 29" or "technical crimpy"' /></div>}
      </div>
    </header>
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

export default Header
