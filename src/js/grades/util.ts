import { ClimbDisciplineRecord } from '../types'

export const disciplineTypeToDisplay = (type: Partial<ClimbDisciplineRecord>): string[] => {
  const ret: string[] = []
  const entries = Object.entries(type)
  for (const [key, value] of entries) {
    if (key === '__typename') continue
    if (value) ret.push(key.charAt(0).toLocaleUpperCase() + key.substring(1))
  }
  return ret
}

/**
 * Convert disciplines object to a space-delimited list of codes.
 * For example, { trad: true, aid: true } --> 'T A'
 * @param type Disciplines object
 * @returns a space-delimited list of codes
 */
export const disciplinesToCodes = (type: Partial<ClimbDisciplineRecord>): string[] => {
  const ret: string[] = []
  const entries = Object.entries(type)
  for (const [key, value] of entries) {
    if (key === '__typename') continue
    if (value) {
      if (key === 'tr') {
        ret.push('TR')
      } else {
        ret.push(key.charAt(0).toUpperCase())
      }
    }
  }
  return ret
}

const safeCodeMap = {
  S: 'sport',
  T: 'trad',
  A: 'aid',
  TR: 'tr',
  B: 'bouldering'
}

/**
 * Convert a space-delimited list of discipline codes to Climb disciplines object
 * @param codesStr Example: 'T S A'
 * @returns [disicpline record, hasError]
 */
export const codesToDisciplines = (codesStr: string): [Partial<ClimbDisciplineRecord>, boolean] => {
  let hasError = false
  const tokens = codesStr.split(' ')
  const ret = tokens.reduce<Partial<ClimbDisciplineRecord>>((acc, token) => {
    const key = safeCodeMap[token.toUpperCase()]
    if (key != null) {
      acc[key] = true
    } else {
      hasError = true
    }
    return acc
  }, {})

  return [ret, hasError]
}

export const defaultDisciplines = (): ClimbDisciplineRecord => ({
  sport: false,
  trad: false,
  bouldering: false,
  aid: false,
  ice: false,
  alpine: false,
  mixed: false,
  tr: false,
  snow: false
})
