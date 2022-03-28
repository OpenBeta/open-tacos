import React, { createElement, Fragment, useEffect, useRef } from 'react'
import { render } from 'react-dom'
import { autocomplete } from '@algolia/autocomplete-js'
import '@algolia/autocomplete-theme-classic'

/**
 * Autocomplete widget based on Algolia Autocomplete
 * @param props
 * @returns
 */
export const Autocomplete = (props): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setTimeout(() => {
      (document.getElementsByClassName('aa-Input')[0] as HTMLInputElement).focus()
    }, 100)
  }, [])
  useEffect(() => {
    if (containerRef.current === null) {
      return undefined
    }

    const search = autocomplete({
      defaultActiveItemId: 0,
      container: containerRef.current,
      renderer: { createElement, Fragment },
      detachedMediaQuery: 'none',
      render ({ children }, root) {
        render(children, root)
      },
      ...props
    })

    return () => {
      search.destroy()
    }
  }, [props])

  return (
    <div className='max-w-lg z-50 mx-auto' ref={containerRef} />
  )
}
