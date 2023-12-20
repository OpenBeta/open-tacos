import { GradeScales, getScale, GradeScalesTypes } from '@openbeta/sandbag'
import { RulesType, GradeValuesType, ClimbDisciplineRecord } from '../types'
import { EditableClimbType } from '../../components/crag/cragSummary'

export enum GradeContexts {
  /** Alaska (United States) */
  ALSK = 'ALSK',
  /** Australia */
  AU = 'AU',
  /** Brazil */
  BRZ = 'BRZ',
  FIN = 'FIN',
  FR = 'FR',
  HK = 'HK',
  NWG = 'NWG',
  POL = 'POL',
  SA = 'SA',
  /** Sweden */
  SWE = 'SWE',
  SX = 'SX',
  UIAA = 'UIAA',
  /** United Kingdom */
  UK = 'UK',
  /** United States of Ameria */
  US = 'US'
}

export type ClimbGradeContextType = Record<keyof ClimbDisciplineRecord, GradeScalesTypes>

export type GradeContextType = Partial<Record<GradeContexts, ClimbGradeContextType>>

export const gradeContextToGradeScales: GradeContextType = {
  [GradeContexts.AU]: {
    trad: GradeScales.EWBANK,
    sport: GradeScales.EWBANK,
    bouldering: GradeScales.VSCALE,
    tr: GradeScales.EWBANK,
    deepwatersolo: GradeScales.EWBANK,
    alpine: GradeScales.YDS,
    mixed: GradeScales.YDS,
    aid: GradeScales.AID,
    snow: GradeScales.YDS, // is this the same as alpine?
    ice: GradeScales.WI
  },
  [GradeContexts.US]: {
    trad: GradeScales.YDS,
    sport: GradeScales.YDS,
    bouldering: GradeScales.VSCALE,
    tr: GradeScales.YDS,
    deepwatersolo: GradeScales.YDS,
    alpine: GradeScales.YDS,
    mixed: GradeScales.YDS,
    aid: GradeScales.AID,
    snow: GradeScales.YDS, // is this the same as alpine?
    ice: GradeScales.WI
  },
  [GradeContexts.FR]: {
    trad: GradeScales.FRENCH,
    sport: GradeScales.FRENCH,
    bouldering: GradeScales.FONT,
    tr: GradeScales.FRENCH,
    deepwatersolo: GradeScales.FRENCH,
    alpine: GradeScales.FRENCH,
    mixed: GradeScales.FRENCH,
    aid: GradeScales.AID,
    snow: GradeScales.FRENCH, // is this the same as alpine?
    ice: GradeScales.WI
  },
  [GradeContexts.SA]: {
    trad: GradeScales.FRENCH,
    sport: GradeScales.FRENCH,
    bouldering: GradeScales.FONT,
    tr: GradeScales.FRENCH,
    deepwatersolo: GradeScales.FRENCH,
    alpine: GradeScales.FRENCH,
    mixed: GradeScales.FRENCH,
    aid: GradeScales.AID,
    snow: GradeScales.FRENCH, // SA does not have a whole lot of snow
    ice: GradeScales.WI
  },
  [GradeContexts.UIAA]: {
    trad: GradeScales.UIAA,
    sport: GradeScales.UIAA,
    bouldering: GradeScales.FONT,
    tr: GradeScales.UIAA,
    deepwatersolo: GradeScales.FRENCH,
    alpine: GradeScales.UIAA,
    mixed: GradeScales.UIAA, // TODO: change to MI scale, once added
    aid: GradeScales.UIAA,
    snow: GradeScales.UIAA, // TODO: remove `snow` since it duplicates `ice`
    ice: GradeScales.WI
  },
  [GradeContexts.BRZ]: {
    trad: GradeScales.BRAZILIAN_CRUX,
    sport: GradeScales.BRAZILIAN_CRUX,
    bouldering: GradeScales.VSCALE,
    tr: GradeScales.BRAZILIAN_CRUX,
    deepwatersolo: GradeScales.BRAZILIAN_CRUX,
    alpine: GradeScales.BRAZILIAN_CRUX,
    mixed: GradeScales.BRAZILIAN_CRUX,
    aid: GradeScales.AID,
    // definitely no ice in brazil, however once this guy
    // top roped a fragile frozen waterfall with ice picks
    // and crampons:
    ice: GradeScales.WI,
    // whenever it snows in brazil, you see it in the news
    snow: GradeScales.WI
  }
}

export default class Grade {
  context: GradeContexts
  values: GradeValuesType
  disciplines: Partial<ClimbDisciplineRecord>
  isBoulder: boolean
  gradescales: any

  constructor (gradeContext: GradeContexts, values: GradeValuesType, disciplines: Partial<ClimbDisciplineRecord>, isBoulder: boolean) {
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
    return this.isBoulder || (this.disciplines?.bouldering ?? false)
  }

  isTradSportTr (): boolean {
    return (this.disciplines?.sport ?? false) || (this.disciplines?.trad ?? false) || (this.disciplines?.tr ?? false) || (this.disciplines?.aid ?? false)
  }

  toStringBouldering (): string | undefined {
    const key: string = this.gradescales.bouldering
    // @ts-expect-error
    return this.values?.[key] ?? undefined
  }

  toStringTradSportAid (): string | undefined {
    const key = this.gradescales.sport
    // @ts-expect-error
    return this.values?.[key] ?? undefined
  }

  get boulderingScaleName (): string {
    return getScale(this.gradescales.bouldering)?.name ?? ''
  }

  get routeScaleName (): string {
    return getScale(this.gradescales.sport)?.name.toUpperCase() ?? ''
  }

  get boulderingValidationRules (): RulesType {
    const isValidGrade = (userInput: string): string | undefined => {
      if (userInput == null || userInput === '') return undefined
      const score = getScale(this.gradescales.bouldering)?.getScore(userInput) ?? -1
      return Array.isArray(score) || score >= 0 ? undefined : 'Invalid grade'
    }
    return {
      validate: {
        isValidGrade
      }
    }
  }

  getSportTradValidationRules (discipline: 'sport' | 'trad' | 'tr' = 'trad'): RulesType {
    const isValidGrade = (userInput: string): string | undefined => {
      if (userInput == null || userInput === '') return undefined // possible to have unknown grade (Ex: route under development)
      const score = getScale(this.gradescales[discipline])?.getScore(userInput) ?? -1
      return Array.isArray(score) || score >= 0 ? undefined : 'Invalid grade'
    }
    return {
      validate: {
        isValidGrade
      }
    }
  }
}

export class GradeHelper {
  gradeScales: any
  isBoulder: boolean

  constructor (gradeContext: GradeContexts, isBoulder: boolean) {
    this.gradeScales = gradeContextToGradeScales?.[gradeContext]
    this.isBoulder = isBoulder
  }

  getBulkValidationRules (): RulesType {
    return {
      validate: (list: EditableClimbType[]): any => {
        const z = list.every(({ errors }) => Object.values(errors ?? {}).filter(v => v != null).length === 0)
        return z ? undefined : 'Format error'
      }
    }
  }

  getValidationRules (discipline?: 'bouldering' | 'sport' | 'trad' | 'tr'): RulesType {
    const isValidGrade = (userInput: string): string | undefined => {
      if (userInput == null || userInput === '') return 'Missing grade'
      const _d = discipline == null && this.isBoulder ? 'bouldering' : 'trad'
      const score = getScale(this.gradeScales[_d])?.getScore(userInput) ?? -1
      return Array.isArray(score) || score >= 0 ? undefined : 'Invalid grade'
    }
    return {
      validate: {
        isValidGrade
      }
    }
  }

  validate (gradeStr: string, discipline?: 'bouldering' | 'sport' | 'trad' | 'tr'): string | undefined {
    const rules = this.getValidationRules(discipline).validate
    if (rules == null) return undefined
    // @ts-expect-error
    // const valid = Object.keys(rules).every(fn => rules[fn].call(gradeStr))
    const error = rules.isValidGrade(gradeStr)
    return error == null ? undefined : 'Invalid grade'
  }
}
