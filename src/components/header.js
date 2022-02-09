import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.js'
import ClimbSearch from './search/ClimbSearch'
import AlgoliaSearchWidget from './search/AlgoliaSearchWidget'
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
    if (window.scrollY > 280) {
      setDirection('down')
      setExpanded(false)
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
    <header
      className={`absolute lg:fixed top-0 z-20 w-full px-4 py-8 md:py-2  mx-auto ${expanded ? ' lg:h-36 ' : 'lg:border-b lg:border-gray-100'} ${direction === 'down' || !isIndexPage ? 'bg-gray-800' : ''}`}
    >
      <nav className='z-50 flex items-center justify-between max-w-screen-2xl '>
        <div className='flex flex-rows justify-start items-center md:gap-x-2'>
          <a href='/' className='hidden md:inline-block cursor-pointer'><Image src='/tortilla.png' height={32} width={32} /></a>
          <a href='/' className='inline-block font-semibold text-2xl lg:text-3xl text-custom-primary'>OpenTacos</a>
        </div>
        <ClimbSearch
          expanded={expanded}
          onClick={onClick}
          onClickOutside={onClickOutside}
        />
        <div
          className='flex items-center gap-x-4'
        >
          {navList.map(item => <NavItem key={item.title} {...item} />)}
        </div>
      </nav>
      <div className='lg:hidden max-w-screen-md w-full'>
        {direction === 'down' && <div className='fixed top-0 left-0 bg-gray-800 px-2 py-2  w-full '><AlgoliaSearchWidget /></div>}
      </div>
    </header>
  )
}

const NavItem = ({ route, title, cta }) => {
  return (
    <TextButton
      className={`btn-small md:btn-medium ${cta ? 'btn-nav-secondary' : 'btn-nav'}`} label={title} to={route}
    />
  )
}

const navList = [
  {
    route: '/about',
    title: 'About'
  },
  {
    route: 'https://discord.gg/2A2F6kUtyh',
    title: 'Discord',
    cta: true
  }
]

export default Header
