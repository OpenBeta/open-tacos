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
