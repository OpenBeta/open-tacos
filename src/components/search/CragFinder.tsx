import { useEffect } from 'react'
import { useRouter } from 'next/router'
import ClientOnly from '../../components/ClientOnly'

import { Autocomplete } from './Autocomplete'
import { geocoderLookup } from '../../js/mapbox/Client'
import { PlaceTemplate } from './CragFinderTemplates'

const SEARCH_OPTIONS = {
  country: 'US',
  region: 'poi,place,region'
}
export interface CragFinderProps {
  isMobile?: boolean
  placeholder?: string
}

const CragFinder = ({ isMobile = true, placeholder = 'Try \'Smith Rock\', \'Las Vegas\'' }: CragFinderProps): JSX.Element => {
  const router = useRouter()
  useEffect(() => {
    if (isMobile) return
    const inputs = document.getElementsByClassName('aa-Input')
    for (let i = 0; i < inputs.length; i++) {
      (inputs[i] as HTMLElement).focus()
    }
  })
  return (
    <Autocomplete
      id='crag-finder'
      classNames={{ item: 'crag-finder-item', panelLayout: 'crag-finder-panelLayout' }}
      placeholder={placeholder}
      getSources={async ({ query }) => {
        if ((query as string).length < 3) {
          return []
        }
        const features = await geocoderLookup(query, SEARCH_OPTIONS)
        return [{
          sourceId: 'location',
          getItems: () => features,
          navigator: {
            async navigate ({ itemUrl }) {
              await router.push(itemUrl)
            }
          },
          getItemUrl ({ item }) {
            // const { hits } = item
            /* eslint-disable-next-line */
            // return hits.length > 0 ? `/climbs/${hits[0].document.climbId}` : ''
            return '/'
          },
          templates: {
            noResults () {
              return 'No results.'
            },
            item ({ item }) {
              return (
                <ClientOnly>
                  <PlaceTemplate key={item.id} placeName={item.place_name} center={item.center} router={router} />
                </ClientOnly>
              )
            }
          }
        }
        ]
      }}
    />
  )
}

export default CragFinder
