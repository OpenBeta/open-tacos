import { MapAreaFeatureProperties, SimpleClimbType } from './GlobalMap'

export interface TileProps {
  id: string
  name: string
  ancestors: string
  pathTokens: string
  content: string
  climbs: string
  media: string
}

/**
 * Map tile properties can only contain primitive types.
 * This function converts stringified json data back to json objects
 */
export const transformTileProps = (p: TileProps): MapAreaFeatureProperties => {
  const { name, ancestors, pathTokens, media, content } = p
  return {
    ...p,
    areaName: name,
    ancestors: JSON.parse(ancestors) as string[],
    pathTokens: JSON.parse(pathTokens) as string[],
    climbs: JSON.parse(p.climbs) as SimpleClimbType[],
    media: JSON.parse(media),
    content: JSON.parse(content)
  }
}
