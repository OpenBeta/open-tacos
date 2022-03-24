import { useEffect } from 'react'
import { useRouter } from 'next/router'
import ClientOnly from '../../components/ClientOnly'

import { Autocomplete } from './Autocomplete'
import { geocoderLookup } from '../../js/mapbox/Client'
import { PlaceTemplate, resultItemToUrl } from './CragFinderTemplates'
// import { useDebounce } from '../../js/hooks/useDebounce'
import { debounced } from '../../js/utils'

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
    // if (isMobile) return
    // const inputs = document.getElementsByClassName('aa-Input')
    // for (let i = 0; i < inputs.length; i++) {
    //   (inputs[i] as HTMLElement).focus()
    // }
  })
  return (
    <Autocomplete
      id='crag-finder'
      classNames={{ item: 'crag-finder-item', panelLayout: 'crag-finder-panelLayout' }}
      placeholder={placeholder}
      getSources={({ query }) => {
        if ((query as string).length < 3) {
          return []
        }
        const features = async (): Promise<any> => await geocoderLookup(query, SEARCH_OPTIONS)
        return debounced([{
          sourceId: 'location',
          getItems: features,
          navigator: {
            async navigate ({ itemUrl }) {
              await router.push(itemUrl)
            }
          },
          getItemUrl ({ item }) {
            const { text, center, id }: {text: string, center: [number, number], id: string } = item
            return resultItemToUrl(text, id, center)
          },
          templates: {
            noResults () {
              return 'No results.'
            },
            item ({ item }) {
              return (
                <ClientOnly>
                  <PlaceTemplate key={item.id} placeName={item.place_name} shortName={item.text} center={item.center} placeId={item.id} router={router} />
                </ClientOnly>
              )
            }
          }
        }
        ])
      }}
    />
  )
}

export default CragFinder
