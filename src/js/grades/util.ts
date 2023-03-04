import { ClimbDisciplineRecord } from '../types'

export const disciplineTypeToDisplay = (type: ClimbDisciplineRecord): string[] => {
  const ret: string[] = []
  const entries = Object.entries(type)
  for (const [key, value] of entries) {
    if (key === '__typename') continue
    if (value) ret.push(key.charAt(0).toLocaleUpperCase() + key.substring(1))
  }
  return ret
}

export const disciplinesToCodes = (type: ClimbDisciplineRecord): string[] => {
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

export const codesToDisciplines = (codesStr: string): ClimbDisciplineRecord => {
  const tokens = codesStr.split(' ')
  return tokens.reduce<ClimbDisciplineRecord>((acc, token) => {
    const key = safeCodeMap[token]
    if (key != null) {
      acc[key] = true
    }
    return acc
  }, defaultDisciplines())
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
