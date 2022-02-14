
import algoliasearch from 'algoliasearch/lite'
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia'
import { SearchResponse } from '@algolia/client-search'

const PAGE_LIMIT = 50

const client = algoliasearch(
  'G7NJXRGX3U',
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY
)

const climbsIndex = client.initIndex('climbs')

function getSearchResults (query): any {
  return getAlgoliaResults({
    searchClient: client,
    queries: [
      {
        indexName: 'climbs',
        query
      }
    ]
  })
}

async function getSerachClimbs (query, attributesToRetrieve): Promise<SearchResponse> {
  return await climbsIndex.search(query, {
    attributesToRetrieve,
    hitsPerPage: PAGE_LIMIT
  })
}

export { getSearchResults, getSerachClimbs }
