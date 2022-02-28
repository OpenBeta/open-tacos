import { useRouter } from 'next/router'
import { typesenseSearch } from './TypesenseUtils'
import { Autocomplete } from './AlgoliaSearchWidget'
import { SearchByNameTemplate } from './ResultTemplates'

export const ClimbSearchByName = ({ placeholder = 'Try \'Levitation\', \'technical crimpy\', or \'Lynn Hill\'' }: {placeholder?: string}): JSX.Element => {
  const router = useRouter()
  return (
    <Autocomplete
      autoFocus
      placeholder={placeholder}
      getSources={async ({ query }) => {
        const items = await typesenseSearch(query)
        return [{
          sourceId: 'climbs',
          getItems: () => items.grouped_hits,
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
        ]
      }}
    />
  )
}
