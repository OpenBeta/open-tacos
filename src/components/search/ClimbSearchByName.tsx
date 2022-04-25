import { useRouter } from 'next/router'
import { typesenseSearch } from '../../js/typesense/TypesenseClient'
import { Autocomplete } from './Autocomplete'
import { SearchByNameTemplate } from './ResultTemplates'
import { debounced } from '../../js/utils'
import { Feature, Geometry } from 'geojson'

export const ClimbSearchByName = ({ isMobile = true, placeholder = 'Try \'Levitation 29\', \'technical crimpy\', or \'Lynn Hill\'' }: {isMobile?: boolean, placeholder?: string}): JSX.Element => {
  const router = useRouter()

  return (

    <Autocomplete
      isMobile={isMobile}
      placeholder={placeholder}
      classNames={{ item: 'name-search-item', panel: 'name-search-panel' }}
      getSources={({ query }) => {
        if ((query as string).length < 3) {
          return []
        }
        const search: () => Promise<Array<Feature<Geometry, { [name: string]: object }>>> = async () => await typesenseSearch(query)
          .then(({ grouped_hits: groupedHits }) => { return groupedHits })
          .catch(() => { return [] })
        const navigate: ({ itemUrl: string }) => Promise<boolean> = async ({ itemUrl }) => await router.push(itemUrl)
        const itemUrl: ({ item }: { item: any }) => string = ({ item }) => {
          const { hits } = item
          const climbUUID: string = hits[0].document.climbUUID
          return hits.length > 0 ? '/climbs/' + climbUUID : ''
        }
        return debounced([
          {
            sourceId: 'climbs',
            getItems: search,
            navigator: navigate,
            getItemUrl: itemUrl,
            templates: {
              noResults () {
                return 'No results.'
              },
              item ({ item }) {
                return (
                  <SearchByNameTemplate router={router} groupKey={item.group_key[0]} hits={item.hits} />
                )
              }
            }
          }
        ])
      }}
    />
  )
}
