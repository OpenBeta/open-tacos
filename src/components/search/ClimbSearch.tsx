import React from 'react'
import algoliasearch from 'algoliasearch/lite'
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia'
import { useRouter } from 'next/router'
import Autocomplete from './Autocomplete'
import { ClimbAlgoliaType } from '../../js/types'
import ResultItem from './ResultItem'
import SearchIcon from '../../assets/icons/search.svg'

const searchClient = algoliasearch(
  'G7NJXRGX3U',
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY
)

interface ClimbSearchProps {
  expanded: boolean
  onClick: any
  onBlur: any
}

const ClimbSearch = ({ expanded, onClick, onBlur }: ClimbSearchProps): JSX.Element => {
  const router = useRouter()

  return (
    <div className='fixed top-0 left-0 w-screen horizontal-center pointer-events-none'>
      <div className='max-w-screen-lg horizontal-center w-full flex flex-col items-center '>
        <FakeSearchBox onClick={onClick} expanded={expanded} />
        {expanded && <div className='py-4 text-secondary-contrast pointer-events-auto'>Find climbs by name, characteristics or FA</div>}
        <div className={`pointer-events-auto opacity-100 ${expanded ? 'w-full horizontal-center ' : 'hidden'}`}>
          <Autocomplete
            placeholder='Try &ldquo;Levitation 29&rdquo;, &ldquo;technical crimpy&rdquo;, or &ldquo;Lynn Hill&rdquo;'
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
        </div>
      </div>
    </div>
  )
}

export const FakeSearchBox = ({ onClick, expanded }: {onClick: any, expanded: boolean}): JSX.Element => {
  return (
    <div className='py-2 pointer-events-auto' onClick={onClick}>
      <div className={`${expanded ? 'hidden h-0' : 'block'} cursor-pointer mt-0.5 border border-gray-200 shadow-sm rounded-full flex flex-row items-center gap-x-4 py-0.5 bg-white`}>
        <div className='pl-4 pr-8 text-sm'>Start your search</div>
        <div className='rounded-full bg-custom-primary p-2 mr-1'>
          <SearchIcon className='stroke-white' />
        </div>
      </div>
    </div>
  )
}

export default ClimbSearch
