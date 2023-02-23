import { GradeScales, getScale } from '@openbeta/sandbag'
import { RulesType, GradeContextType, GradeValuesType, ClimbDisciplineRecord } from '../types'

const gradeContextToGradeScales = {
  US: {
    trad: GradeScales.YDS,
    sport: GradeScales.YDS,
    bouldering: GradeScales.VSCALE,
    tr: GradeScales.YDS,
    alpine: GradeScales.YDS,
    mixed: GradeScales.YDS,
    aid: GradeScales.YDS,
    snow: GradeScales.YDS, // is this the same as alpine?
    ice: GradeScales.YDS // is this the same as alpine?
  },
  FR: {
    trad: GradeScales.FRENCH,
    sport: GradeScales.FRENCH,
    bouldering: GradeScales.FONT,
    tr: GradeScales.FRENCH,
    alpine: GradeScales.FRENCH,
    mixed: GradeScales.FRENCH,
    aid: GradeScales.FRENCH,
    snow: GradeScales.FRENCH, // is this the same as alpine?
    ice: GradeScales.FRENCH // is this the same as alpine?
  }
}

export default class Grade {
  context: GradeContextType
  values: GradeValuesType
  disciplines: ClimbDisciplineRecord
  isBoulder: boolean
  gradescales: any
  constructor (gradeContext: GradeContextType, values: GradeValuesType, disciplines: ClimbDisciplineRecord, isBoulder: boolean) {
    if (gradeContext == null) throw new Error('Missing grade context')
    this.context = gradeContext
    this.values = values
    this.isBoulder = isBoulder
    this.disciplines = disciplines
    this.gradescales = gradeContextToGradeScales?.[gradeContext]
  }

  toString (): string | undefined {
    if (this.isBouldering()) return this.toStringBouldering()
    if (this.isTradSportTr()) return this.toStringTradSportAid()
    return undefined
  }

  isBouldering (): boolean {
    return this.isBoulder || this.disciplines.bouldering
  }

  isTradSportTr (): boolean {
    return this.disciplines.sport || this.disciplines.trad || this.disciplines.tr || this.disciplines.aid
  }

  toStringBouldering (): string | undefined {
    const key: string = this.gradescales.bouldering
    return this.values?.[key] ?? undefined
  }

  toStringTradSportAid (): string | undefined {
    const key = this.gradescales.sport
    return this.values?.[key] ?? undefined
  }

  get boulderingScaleName (): string {
    return getScale(this.gradescales.bouldering)?.displayName ?? ''
  }

  boulderingValidationRules (): RulesType {
    const isValidGrade = (userInput: string): string | undefined => {
      if (userInput == null || userInput === '') return undefined
      const score = getScale(this.gradescales.bouldering)?.getScore(userInput) ?? -1
      return score >= 0 || Array.isArray(score) ? undefined : 'Invalid grade'
    }
    return {
      validate: {
        isValidGrade
      }
    }
  }
}
