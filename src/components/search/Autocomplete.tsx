import React, { createElement, Fragment, useEffect, useRef, ReactElement } from 'react'
import { render as reactRender } from 'react-dom'
import { autocomplete, AutocompleteOptions } from '@algolia/autocomplete-js'
import '@algolia/autocomplete-theme-classic'

import classNames from 'classnames'

interface AutocompleteProps extends Partial<AutocompleteOptions<any>> {
  isMobile: boolean
  containerClassname?: string
  forceFocus: boolean
}
/**
 * Autocomplete widget based on Algolia Autocomplete
 * @param props
 * @returns
 */
export const Autocomplete = ({ forceFocus = false, ...otherProps }: AutocompleteProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (forceFocus) {
      setTimeout(() => {
        const element = document.querySelectorAll(`.${otherProps.id as string} .aa-Input`)[0] as HTMLInputElement
        element?.focus()
      }, 200)
    }
  })

  useEffect(() => {
    if (containerRef.current == null) {
      return undefined
    }

    const search = autocomplete({
      defaultActiveItemId: 0,
      container: containerRef.current,
      renderer: { createElement, Fragment },
      detachedMediaQuery: (otherProps.isMobile) ? '' : 'none',
      render ({ children }, root) {
        reactRender(children as ReactElement, root)
      },
      ...otherProps
    })

    return () => {
      search.destroy()
    }
  }, [otherProps])

  return (
    <div
      className={
        classNames(
          otherProps.isMobile ? '' : 'z-50 mx-auto',
          otherProps?.containerClassname)
      }
      ref={containerRef}
    />
  )
}
