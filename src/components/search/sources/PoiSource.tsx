'use client'
import { AutocompleteSource } from '@algolia/autocomplete-js'
import { geocoderLookup } from '../../../js/mapbox/MapboxClient'
import { PlaceTemplate } from '../CragFinderTemplates'
import { DefaultHeader, DefaultNoResult } from '../templates/ClimbResultXSearch'
import ClientOnly from '../../ClientOnly'
import { BaseItem } from '@algolia/autocomplete-core'

interface PoiDoc extends BaseItem {
  text: string
  id: string
  place_name: string
  center: [number, number]
}

/**
 * Call Mapbox Geocoder to find cities, landmarks, and point-of-interests that
 * match 'query'.  Wrap result in Algolia.Source object to allow Autocomplete component.
 * See also https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/sources/
 * to render the result.
 * @deprecated
 * @param query search string
 */
export const searchPoi = async (query: string): Promise<AutocompleteSource<any>> => {
  const rs = await geocoderLookup(query)
  return {
    sourceId: 'Address',
    getItems: async ({ query }) => rs,
    templates: {
      noResults: DefaultNoResult,
      item: ({ item }: { item: PoiDoc }) => {
        return (
          <a href={`/finder?shortName=${item.text}&placeId=${item.id}&center=${item.center.join(',')}`}>
            <ClientOnly>
              <PlaceTemplate
                key={item.id}
                placeName={item.place_name}
                shortName={item.text}
                center={item.center}
                placeId={item.id}
              />
            </ClientOnly>
          </a>
        )
      },
      header: DefaultHeader // you can also define your own header
    }
  }
}
