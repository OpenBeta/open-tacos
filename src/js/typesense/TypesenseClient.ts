import Typesense from 'typesense'
import { SearchResponseHit } from 'typesense/lib/Typesense/Documents'
import { TypesenseDocumentType, TypesenseAreaType, EntityType } from '../types'

const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: process.env.NEXT_PUBLIC_TYPESENSE_NODES ?? '',
      port: 443,
      protocol: 'https'
    }
  ],
  apiKey: process.env.NEXT_PUBLIC_TYPESENSE_API_KEY ?? '',
  numRetries: 3, // A total of 4 tries (1 original try + 3 retries)
  logLevel: 'info'
})

/**
 * Search climbs by name, description, fa, area name
 * @param query search string
 * @returns result group by discipline
 */
export const typesenseSearch = async (query: string): Promise<any> => {
  return await typesenseClient.collections('climbs').documents().search({
    q: query,
    query_by: 'climbName, climbDesc, fa, areaNames',
    exclude_fields: 'climbDesc',
    facet_by: 'disciplines',
    group_by: 'disciplines'
  })
}

export const climbSearchByName = async (query: string): Promise<any> => {
  const rs = await typesenseClient.collections('climbs').documents().search({
    q: query,
    query_by: 'climbName,disciplines,areaNames',
    exclude_fields: 'climbDesc,fa'
  })
  return rs?.hits?.map(hit => hit.document) ?? []
}

export const areaSearchByName = async (query: string, latlng: number[]): Promise<any> => {
  const rs = await typesenseClient.collections('areas').documents().search({
    q: query,
    query_by: 'name,pathTokens',
    filter_by: `areaLatLng:(${latlng[0]}, ${latlng[1]}, 500 km)`,
    sort_by: `_text_match:desc,totalClimbs:desc,areaLatLng(${latlng[0]}, ${latlng[1]}, precision: 0.5 km):asc`
  })
  return rs?.hits?.map(hit => hit.document) ?? []
}

export interface MultisearchReturnType {
  climbs: TypesenseDocumentType[]
  areas: TypesenseAreaType[]
  fa: TypesenseDocumentType[]
}

/**
 * Search multiple collections in one request
 * @param query
 */
export async function multiSearch (query: string): Promise<MultisearchReturnType> {
  // See https://typesense.org/docs/0.19.0/api/documents.html#federated-multi-search
  const commonSearchParams = {

  }
  const searchRequests = {
    searches: [
      {
        q: query,
        query_by: 'climbName, areaNames',
        collection: 'climbs',
        exclude_fields: 'climbDesc',
        page: 1,
        per_page: 7
      },
      {
        q: query,
        query_by: 'name,pathTokens',
        collection: 'areas',
        sort_by: '_text_match:desc,totalClimbs:desc',
        page: 1,
        per_page: 5
      },
      {
        q: query,
        query_by: 'fa',
        collection: 'climbs',
        exclude_fields: 'climbDesc',
        page: 1,
        per_page: 5
      }
    ]
  }

  const rs = await typesenseClient.multiSearch.perform(searchRequests, commonSearchParams)
  // FYI: rs.results contains a lot more useful data
  const x: MultisearchReturnType = {
    climbs: (rs?.results[0] as any)?.hits?.map((hit: any) => ({ ...hit?.document, type: EntityType.climb })) ?? [],
    areas: (rs?.results[1] as any)?.hits?.map(reshapAreaDoc) ?? [],
    fa: (rs?.results[2] as any)?.hits?.map((hit: any) => hit?.document) ?? []
  } as any

  return x
}

/**
 * Extract hit's document and simplify Typense highlight object that
 * contains indices of matching area(s) or subarea(s).
 * @param hit Typesense hit
 */
const reshapAreaDoc = (hit: SearchResponseHit<any>): TypesenseAreaType => {
  let highlightIndices: number[] = []
  if ((hit?.highlights?.length ?? 0) > 0) {
    const found = hit.highlights?.find(item => item.field === 'pathTokens')
    if (found != null) {
      highlightIndices = found.indices as number[]
    }
  }
  return {
    ...hit.document,
    highlightIndices,
    type: hit.document.leaf === 'true' ? EntityType.crag : EntityType.area
  }
}
