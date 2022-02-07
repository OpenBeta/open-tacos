import React, { createElement, Fragment, useEffect, useRef } from 'react'
import { render } from 'react-dom'
import { autocomplete } from '@algolia/autocomplete-js'
import '@algolia/autocomplete-theme-classic'
import algoliasearch from 'algoliasearch/lite'
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia'
import { ClimbAlgoliaType } from '../../js/types'
import ResultItem from './ResultItem'
import { useRouter } from 'next/router'

const searchClient = algoliasearch(
  'G7NJXRGX3U',
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY
)

export const Autocomplete = (props): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current === null) {
      return undefined
    }

    const search = autocomplete({
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

  return <div className='w-full' ref={containerRef} />
}

export const AlgoliaSearchWidget = (props: any): JSX.Element => {
  const router = useRouter()
  return (
    <Autocomplete
      placeholder='Try &ldquo;Levitation 29&rdquo;, &ldquo;technical crimpy&rdquo;, or &ldquo;Lynn Hill&rdquo;'
      none
      getSources={({ query }) => [
        {
          sourceId: 'climbs',
          getItems: () => {
            return getAlgoliaResults({
              searchClient,
              queries: [
                {
                  indexName: 'climbs',
                  query
                }
              ]
            })
          },
          navigator: {
            async navigate ({ itemUrl }) {
              await router.push(itemUrl)
            }
          },
          getItemUrl ({ item }: {item: ClimbAlgoliaType}) {
            return `/climbs/${item.objectID}`
          },

          templates: {
            item ({ item, components }) {
              return <ResultItem router={router} {...item} />
            }
          }

        }]}
    />
  )
}

export default AlgoliaSearchWidget
