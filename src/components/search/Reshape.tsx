import type { AutocompleteReshapeSourcesBySourceId } from '@algolia/autocomplete-core'
import { reshapeClimbSource } from './ClimbSource'
import { reshapeFASource } from './FASource'
import { reshapeAreaSource } from './AreaSource'

interface ReshapeResultsProps {
  sourcesBySourceId: AutocompleteReshapeSourcesBySourceId<any>
}

export const reshapeResults = ({ sourcesBySourceId }: ReshapeResultsProps): any => {
  const { typesense } = sourcesBySourceId
  const rs = typesense.getItems()
  if (!Array.isArray(rs) || rs.length < 1) {
    return []
  }

  const { climbs, areas, fa } = rs[0]
  return [
    reshapeClimbSource(climbs, typesense),
    reshapeAreaSource(areas, typesense),
    reshapeFASource(fa, typesense)
  ]
}
