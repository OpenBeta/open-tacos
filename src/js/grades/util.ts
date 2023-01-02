import { getScale, GradeScales, GradeScalesTypes } from '@openbeta/sandbag'

import { ClimbDisciplineRecord, ClimbType, GradeContextType, ClimbDiscipline } from '../types'

export const disciplineTypeToDisplay = (type: ClimbDisciplineRecord): string[] => {
  const ret: string[] = []
  const entries = Object.entries(type)
  for (const [key, value] of entries) {
    if (key === '__typename') continue
    if (value) ret.push(key.charAt(0).toLocaleUpperCase() + key.substring(1))
  }
  return ret
}

export const gradesToString = ({ grades, type, gradeContext }: Pick<ClimbType, 'grades' | 'type' | 'gradeContext'>): string => {
  // if (type.sport || type.trad || type.aid || type.tr) {

  // }
  return ''
}

export type ClimbGradeContextType = Record<keyof ClimbDiscipline, GradeScalesTypes>

/**
 * A conversion from grade context to corresponding grade type / scale
 * Todo: move this to @openbeta/sandbag
 */
// export const gradeContextToGradeScales: Partial<Record<GradeContextType, ClimbGradeContextType>> = {
//   US: {
//     trad: GradeScales.YDS,
//     sport: GradeScales.YDS,
//     bouldering: GradeScales.VSCALE,
//     tr: GradeScales.YDS,
//     alpine: GradeScales.YDS,
//     mixed: GradeScales.YDS,
//     aid: GradeScales.YDS,
//     snow: GradeScales.YDS, // is this the same as alpine?
//     ice: GradeScales.YDS // is this the same as alpine?
//   },
//   FR: {
//     trad: GradeScales.FRENCH,
//     sport: GradeScales.FRENCH,
//     bouldering: GradeScales.FONT,
//     tr: GradeScales.FRENCH,
//     alpine: GradeScales.FRENCH,
//     mixed: GradeScales.FRENCH,
//     aid: GradeScales.FRENCH,
//     snow: GradeScales.FRENCH, // is this the same as alpine?
//     ice: GradeScales.FRENCH // is this the same as alpine?
//   }
// }
