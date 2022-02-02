import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import ClimbSearch from './search/ClimbSearch'
import { TextButton, SmartLink } from './ui/Button'

function Header () {
  const router = useRouter()
  const [isExpanded, toggleExpansion] = useState(false)
  const [direction, setDirection] = useState('top')

  const controlDirection = () => {
    if (window.scrollY > 200) {
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

  const [expanded, setExpanded] = useState(false)
  useEffect(() => {
    if (router.pathname === '/') { setExpanded(direction === 'top') }
  }, [direction])

  const onClick = () => setExpanded(!expanded)
  const onClickOutside = () => setExpanded(false)

  return (
    <header
      className={`fixed top-0 z-20 w-full transition-all duration-300 ease-in-out ${expanded ? ' lg:h-36 bg-opacity-100' : 'border-b border-gray-100 lg:h-16 bg-opacity-90'} ${isExpanded ? 'bg-gray-800 border-b-2 border-black filter drop-shadow-md' : 'bg-gray-800'
        }`}
    >
      <div className='z-50 flex flex-wrap items-center justify-between max-w-screen-2xl px-4 py-4 mx-auto'>
        <a href='/' className='hidden md:flex flex-nowrap items-center gap-x-2'>
          <div><Image className='cursor-pointer' src='/tortilla.png' height={32} width={32} /></div>
          <span className='font-bold text-custom-primary'>OpenTacos</span>
        </a>
        <ClimbSearch expanded={expanded} onClick={onClick} onClickOutside={onClickOutside} />

        <button
          className='items-center block px-3 py-2 text-black border border-white rounded lg:hidden'
          onClick={() => toggleExpansion(!isExpanded)}
        >
          <svg
            className='w-3 h-3 fill-current'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <title>Menu</title>
            <path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' />
          </svg>
        </button>
        <nav
          className={`text-primary-contrast text-2xl ${isExpanded ? 'block mt-4 divide-y' : 'hidden'
            } lg:text-lg lg:flex lg:flex-row lg:items-center lg:justify-end w-full lg:w-auto lg:gap-x-8`}
        >
          {[
            {
              route: '/about',
              title: 'About'
            },
            {
              route: 'https://discord.gg/2A2F6kUtyh',
              title: 'Discord',
              style: 'button'
            }
          ].map(item => <NavItem key={item.title} {...item} />)}
        </nav>
      </div>
    </header>
  )
}
//  <NavItem key={item.title} {...item} />
const NavItem = ({ route, title, style = 'link' }) => {
  if (style === 'button') {
    return (<TextButton label={title} to={route} />)
  }
  return (<SmartLink url={route} clz='text-ob-tertiary font-semibold hover:underline decoration-2'>{title}</SmartLink>)
}

export default Header
