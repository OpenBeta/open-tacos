import React, { createElement, Fragment, useEffect, useRef, ReactElement } from 'react'
import { render as reactRender } from 'react-dom'
import { autocomplete, AutocompleteOptions } from '@algolia/autocomplete-js'
import '@algolia/autocomplete-theme-classic'

import classNames from 'classnames'

interface AutocompleteProps extends Partial<AutocompleteOptions<any>> {
  isMobile: boolean
  containerClassname?: string
}
/**
 * Autocomplete widget based on Algolia Autocomplete
 * @param props
 * @returns
 */
export const Autocomplete = (props: AutocompleteProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setTimeout(() => {
      const element = document.querySelectorAll(`.${props.id as string} .aa-Input`)[0] as HTMLInputElement
      element?.focus()
    }, 200)
  })

  useEffect(() => {
    if (containerRef.current == null) {
      return undefined
    }

    const search = autocomplete({
      defaultActiveItemId: 0,
      container: containerRef.current,
      renderer: { createElement, Fragment },
      detachedMediaQuery: (props.isMobile) ? '' : 'none',
      render ({ children }, root) {
        reactRender(children as ReactElement, root)
      },
      ...props
    })

    return () => {
      search.destroy()
    }
  }, [props])

  return (
    <div
      className={
        classNames(
          props.isMobile ? 'w-24 ' : 'z-50 mx-auto',
          props?.containerClassname)
      }
      ref={containerRef}
    />
  )
}
