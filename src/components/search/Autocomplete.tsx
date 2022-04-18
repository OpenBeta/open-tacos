import React, { createElement, Fragment, useEffect, useRef } from 'react'
import { render } from 'react-dom'
import { autocomplete } from '@algolia/autocomplete-js'
import '@algolia/autocomplete-theme-classic'
import classNames from 'classnames'

/**
 * Autocomplete widget based on Algolia Autocomplete
 * @param props
 * @returns
 */
export const Autocomplete = (props): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setTimeout(() => {
      const element = document.getElementsByClassName('aa-Input')[0] as HTMLInputElement
      element?.focus()
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

  const isMobile: boolean = props.isMobile
  return (
    <div className={classNames('max-w-lg z-50 mx-auto', isMobile ? 'scale-75' : '')} ref={containerRef} />
  )
}
