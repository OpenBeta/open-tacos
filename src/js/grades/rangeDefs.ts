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
