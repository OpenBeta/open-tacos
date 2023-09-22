import React, { createElement, Fragment, ReactNode, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'

import { autocomplete, AutocompleteOptions, AutocompleteApi } from '@algolia/autocomplete-js'
import '@algolia/autocomplete-theme-classic'

interface AutocompleteProps extends Partial<AutocompleteOptions<any>> {
  queryParams?: {
    text: string
    data: any
  }
  label?: string | JSX.Element
  placeholder?: string
  open?: boolean
  onCancel?: () => void
  detached?: boolean
  resultContainer?: (children: ReactNode[]) => ReactNode
}
/**
 * Autocomplete widget based on Algolia Autocomplete.
 * @param props
 */
export const Autocomplete2 = ({ label, open = false, onCancel, detached = true, queryParams, classNames, resultContainer, ...otherProps }: AutocompleteProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRootRef = useRef<any>(null)
  const rootRef = useRef<HTMLElement | null>(null)
  const [search, setSearch] = useState<AutocompleteApi<any> | null>(null)

  useEffect(() => {
    if (containerRef.current == null) {
      return undefined
    }

    const search = autocomplete({
      openOnFocus: true,
      classNames: { ...AA_DEFAULT_CLASSES, ...classNames },
      defaultActiveItemId: 0,
      container: containerRef.current,
      renderer: { createElement, Fragment, render: () => {} },
      onStateChange: props => {
        if (props.prevState.isOpen && !props.state.isOpen) {
          if (onCancel != null) onCancel()
        }
      },
      detachedMediaQuery: detached ? '' : 'none',
      render ({ children, html, render, sections }, root) {
        if ((panelRootRef.current == null) || rootRef.current !== root) {
          rootRef.current = root
          panelRootRef.current?.unmount()
          panelRootRef.current = createRoot(root)
        }

        if (resultContainer != null) {
          panelRootRef.current.render(resultContainer(sections))
        } else {
          panelRootRef.current.render(children)
        }
      },
      ...otherProps
    })

    setSearch(search)

    return () => {
      if (search != null) {
        search.destroy()
      }
    }
  }, [])

  useEffect(() => {
    if (search != null) {
      search.setIsOpen(open)
    }
  }, [open])

  const onClickHandler = (): void => {
    if (search != null) {
      search.setIsOpen(true)
    }
  }

  return (
    <div className='z-40 inline-flex xl:w-full' ref={containerRef} onClick={onClickHandler}>{label}</div>
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
