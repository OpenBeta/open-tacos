import React, { createElement, Fragment, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'

import { autocomplete, AutocompleteOptions, AutocompleteApi } from '@algolia/autocomplete-js'
import '@algolia/autocomplete-theme-classic'

import clz from 'classnames'

interface AutocompleteProps extends Partial<AutocompleteOptions<any>> {
  queryParams?: {
    text: string
    data: any
  }
  isMobile: boolean
  containerClassname?: string
  forceFocus?: boolean
}
/**
 * Autocomplete widget based on Algolia Autocomplete
 * @deprecated This version is deprecated. Use Autocomplete2 instead.
 * @param props
 */
export const Autocomplete = ({ queryParams, forceFocus = false, classNames, ...otherProps }: AutocompleteProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRootRef = useRef<any>(null)
  const rootRef = useRef<HTMLElement|null>(null)
  let search: AutocompleteApi<any> | null = null

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

    search = autocomplete({
      classNames: { ...AA_DEFAULT_CLASSES, ...classNames },
      defaultActiveItemId: 0,
      container: containerRef.current,
      renderer: { createElement, Fragment, render: () => {} },
      detachedMediaQuery: (otherProps.isMobile) ? '' : 'none',
      render ({ children, elements }, root) {
        if ((panelRootRef.current == null) || rootRef.current !== root) {
          rootRef.current = root
          panelRootRef.current?.unmount()
          panelRootRef.current = createRoot(root)
        }

        panelRootRef.current.render(children)
      },
      ...otherProps
    })

    return () => {
      if (search != null) search.destroy()
    }
  }, [otherProps])

  return (
    <div
      className={
        clz(
          otherProps.isMobile ? '' : 'z-50 mx-auto',
          otherProps?.containerClassname)
      }
      ref={containerRef}
      onClick={() => {
        if (search != null && queryParams?.text != null) {
          search.setQuery(queryParams.text)
        }
      }}
    />
  )
}

// For customization see algolia.css
export const AA_DEFAULT_CLASSES = {
  item: 'aa-default-mobile-item',
  form: 'aa-default-mobile-form',
  submitButton: 'aa-default-mobile-submit-button',
  detachedSearchButton: 'aa-default-mobile-trigger-btn',
  detachedSearchButtonIcon: 'aa-default-mobile-trigger-btn-icon',
  detachedCancelButton: 'aa-default-mobile-cancel-button',
  detachedSearchButtonPlaceholder: 'aa-default-mobile-placeholder'
}
