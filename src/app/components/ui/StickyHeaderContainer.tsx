'use client'
import { useRef, ReactNode } from 'react'
import { useIntersection } from 'react-use'
import clx from 'classnames'

/**
 * A container that becomes sticky when being scrolled to the top of the window.
 * Useful for wrapper nav bar.
 */
export const StickyHeaderContainer: React.FC<{ children: ReactNode }> = ({ children }) => {
  const intersectionRef = useRef(null)
  /**
   * Creating an intersection hook to be notified when div reaches become 'sticky'
   * aka reaches the top.
   */
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: '0px 0px -100% 0px'
  })
  const atTop = intersection?.isIntersecting ?? false

  return (
    <div ref={intersectionRef} className={clx('sticky top-0 z-40 py-2 lg:min-h-[4rem] block lg:flex lg:items-center lg:justify-between bg-base-100 -mx-6 px-6', atTop ? 'border-b border-base-300/60 bottom-shadow backdrop-blur-sm bg-opacity-90' : '')}>
      {children}
    </div>
  )
}
