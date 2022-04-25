import type { AutocompleteReshapeSourcesBySourceId } from '@algolia/autocomplete-core'
import { reshapeClimbSource } from './sources/ClimbSource'
import { reshapeFASource } from './sources/FASource'
import { reshapeAreaSource } from './sources/AreaSource'

interface ReshapeResultsProps {
  sourcesBySourceId: AutocompleteReshapeSourcesBySourceId<any>
}

/**
 * See also https://www.algolia.com/doc/ui-libraries/autocomplete/guides/reshaping-sources/
 */
export const reshapeResults = ({ sourcesBySourceId }: ReshapeResultsProps): any => {
  const { typesense, ...rest } = sourcesBySourceId
  const rs = typesense.getItems()
  if (!Array.isArray(rs) || rs.length < 1) {
    return []
  }

  const { climbs, areas, fa } = rs[0]
  return [
    reshapeClimbSource(climbs, typesense),
    reshapeAreaSource(areas, typesense),
    reshapeFASource(fa, typesense),
    Object.values(rest)
  ]
}
