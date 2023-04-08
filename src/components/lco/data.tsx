import { LCOProfileType } from './PageBanner'
import lcos from './lcos.json'

import { v5 as uuidv5 } from 'uuid'

function stringToUUID (seed: string): string {
  // Generate a UUID v5 from the seed and namespace
  const uuid = uuidv5(seed, uuidv5.URL)

  // Return the new UUID
  return uuid
}

/**
 * A hand-coded list of LCOs held at
 * https://docs.google.com/spreadsheets/d/1Mtb-q4gsg_fc-8B6ecDTlU8XBRjswvVs9HdbU2OTNUk/edit?usp=sharing
 * And transformed to the correct JSON using a small python script
 */
export const LCO_LIST: LCOProfileType[] = lcos.map(i => ({ ...i, id: stringToUUID(i.id) }))
