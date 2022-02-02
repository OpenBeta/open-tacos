import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import ClimbSearch from './search/ClimbSearch'

function Header () {
  const [isExpanded, toggleExpansion] = useState(false)

  const [direction, setDirection] = useState('top')

  const controlDirection = () => {
    if (window.scrollY > 200) {
      setDirection('down')
      setExpanded(false)
    } else {
      setDirection('top')
    }
    // oldScrollY = window.scrollY
  }

  useEffect(() => {
    window.addEventListener('scroll', controlDirection)
    return () => {
      window.removeEventListener('scroll', controlDirection)
    }
  }, [])

  const [expanded, setExpanded] = useState(direction)
  useEffect(() => {
    setExpanded(direction === 'top')
  }, [direction])

  const onClick = () => setExpanded(!expanded)
  const onBlur = () => {
    console.log('blur')
    expanded && setExpanded(false)
  }

  console.log(direction)
  return (
    <header
      className={`fixed top-0 z-20 border-b w-full transition-all duration-300 ease-in-out ${expanded ? ' lg:h-36 ' : 'lg:h-16'} ${isExpanded ? 'bg-gray-800 border-b-2 border-black filter drop-shadow-md' : 'bg-gray-800'
        }`}
    >
      <div className='flex flex-wrap items-center justify-between max-w-screen-2xl px-4 py-4 mx-auto'>
        <a href='/' className='hidden md:flex flex-nowrap items-center gap-x-2'>
          <div><Image className='cursor-pointer' src='/tortilla.png' height={32} width={32} /></div>
          <span className='font-bold text-custom-primary'>OpenTacos</span>
        </a>
        <ClimbSearch expanded={expanded} onClick={onClick} onBlur={onBlur} />

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
          className={`text-primary-contrast text-2xl lg:text-sm ${isExpanded ? 'block mt-4 divide-y' : 'hidden'
            } lg:flex lg:justify-end w-full lg:w-auto`}
        >
          {[
            {
              route: '/about',
              title: 'About'
            },
            {
              route: '/history',
              title: 'History'
            },
            {
              route: '/export',
              title: 'Export'
            }
          ].map((link) => (
            <a
              className='block no-underline lg:py-4 lg:inline-block lg:px-4 py-4 lg:py-0'
              key={link.title}
              href={link.route}
            >
              {link.title}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
