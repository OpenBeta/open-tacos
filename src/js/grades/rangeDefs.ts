import { getScoreForSort, GradeScales } from '@openbeta/sandbag'
export interface RangeEntryType {
  value: number // index
  label: string // for display
  score: number // precalculated score for sorting/filtering
}

export interface RangeEntry {
  score: number
  label: string
}
export type SliderMarksType = Record<number, RangeEntry>

export const YDS_DEFS: SliderMarksType =
{
  0: {
    score: 0,
    label: '3rd class'
  },
  1: {
    score: 5,
    label: '4th class'
  },
  2: {
    label: '5.0',
    score: getScoreForSort('5.0', GradeScales.Yds)
  },
  3: {
    label: '5.5',
    score: getScoreForSort('5.5', GradeScales.Yds)
  },
  4: {
    label: '5.6',
    score: getScoreForSort('5.6', GradeScales.Yds)
  },
  5: {
    label: '5.7',
    score: getScoreForSort('5.7', GradeScales.Yds)
  },
  6: {
    label: '5.8',
    score: getScoreForSort('5.8', GradeScales.Yds)
  },
  7: {
    label: '5.9',
    score: getScoreForSort('5.9', GradeScales.Yds)
  },
  8: {
    label: '5.10',
    score: getScoreForSort('5.10', GradeScales.Yds)
  },
  9: {
    label: '5.11',
    score: getScoreForSort('5.11', GradeScales.Yds)
  },
  10: {
    label: '5.12',
    score: getScoreForSort('5.12', GradeScales.Yds)
  },
  11: {
    label: '5.13',
    score: getScoreForSort('5.13', GradeScales.Yds)
  },
  12: {
    label: '5.14',
    score: getScoreForSort('5.14', GradeScales.Yds)
  },
  13: {
    label: '5.15',
    score: getScoreForSort('5.15', GradeScales.Yds)
  }
}

export const BOULDER_DEFS: SliderMarksType =
{
  0: {
    score: -1,
    label: 'V-easy'
  },
  1: {
    score: getScoreForSort('v0', GradeScales.VScale),
    label: 'V0'
  },
  2: {
    score: getScoreForSort('v1', GradeScales.VScale),
    label: 'V1'
  },
  3: {
    label: 'V2',
    score: getScoreForSort('v2', GradeScales.VScale)
  },
  4: {
    label: 'V3',
    score: getScoreForSort('v3', GradeScales.VScale)
  },
  5: {
    label: 'V4',
    score: getScoreForSort('v4', GradeScales.VScale)
  },
  6: {
    label: 'V5',
    score: getScoreForSort('v5', GradeScales.VScale)
  },
  7: {
    label: 'V6',
    score: getScoreForSort('v6', GradeScales.VScale)
  },
  8: {
    label: 'V7',
    score: getScoreForSort('v7', GradeScales.VScale)
  },
  9: {
    label: 'V8',
    score: getScoreForSort('v8', GradeScales.VScale)
  },
  10: {
    label: 'V9',
    score: getScoreForSort('v9', GradeScales.VScale)
  },
  11: {
    label: 'V10',
    score: getScoreForSort('v10', GradeScales.VScale)
  },
  12: {
    label: 'V11',
    score: getScoreForSort('V11', GradeScales.VScale)
  },
  13: {
    label: 'V12',
    score: getScoreForSort('v12', GradeScales.VScale)
  },
  14: {
    label: 'V13+',
    score: getScoreForSort('v13+', GradeScales.VScale)
  }
}
