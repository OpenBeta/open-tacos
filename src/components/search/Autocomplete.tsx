import { autocomplete } from '@algolia/autocomplete-js'
import '@algolia/autocomplete-theme-classic'
import React, { createElement, Fragment, useEffect, useRef } from 'react'
import { render } from 'react-dom'

function Autocomplete (props): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current === null) {
      return undefined
    }

    const search = autocomplete({
      container: containerRef.current,
      renderer: { createElement, Fragment },
      render ({ children }, root) {
        render(children, root)
      },
      ...props
    })

    return () => {
      search.destroy()
    }
  }, [props])

  return <div className='w-full max-w-screen-sm' ref={containerRef} />
}

export default Autocomplete
