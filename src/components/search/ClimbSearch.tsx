import algoliasearch from 'algoliasearch/lite'
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia'
import { useRouter } from 'next/router'
import Autocomplete from './Autocomplete'
import { Climb } from '../../js/types'
import ResultItem from './ResultItem'

const searchClient = algoliasearch(
  'G7NJXRGX3U',
  `process.env.${NEXT_PUBLIC_ALGOLIA_API_KEY}`
)

const ClimbSearch = (): JSX.Element => {
  const router = useRouter()
  return (
    <Autocomplete
      placeholder='Try &ldquo;Nine Gallon Buckets&rdquo;, &ldquo;technical crimpy&rdquo;, or &ldquo;Alan Watts&rdquo;'
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
          getItemUrl ({ item }: {item: Climb}) {
            return `/climbs/${item.metadata.climb_id}`
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

export default ClimbSearch
