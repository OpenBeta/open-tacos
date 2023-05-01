import { validate as uuidValidate } from 'uuid'

export const MUUID_VALIDATION = {
  validate: (value: string) => {
    return conjoinedStringToArray(value).every(uuidValidate) || 'Expected comma-separated MUUID hex strings eg. 49017dad-7baf-5fde-8078-f3a4b1230bbb, 88352d11-eb85-5fde-8078-889bb1230b11...'
  }
}

/**
 * Convert comma-separated string to array.
 * Notably, '' and ',' return [].
 */
export function conjoinedStringToArray (conjoined: string): string[] {
  return conjoined.split(',').map(s => s.trim()).filter(s => s !== '')
}
