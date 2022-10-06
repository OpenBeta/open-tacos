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
    score: getScoreForSort('5.0', GradeScales.YDS)
  },
  3: {
    label: '5.5',
    score: getScoreForSort('5.5', GradeScales.YDS)
  },
  4: {
    label: '5.6',
    score: getScoreForSort('5.6', GradeScales.YDS)
  },
  5: {
    label: '5.7',
    score: getScoreForSort('5.7', GradeScales.YDS)
  },
  6: {
    label: '5.8',
    score: getScoreForSort('5.8', GradeScales.YDS)
  },
  7: {
    label: '5.9',
    score: getScoreForSort('5.9', GradeScales.YDS)
  },
  8: {
    label: '5.10',
    score: getScoreForSort('5.10', GradeScales.YDS)
  },
  9: {
    label: '5.11',
    score: getScoreForSort('5.11', GradeScales.YDS)
  },
  10: {
    label: '5.12',
    score: getScoreForSort('5.12', GradeScales.YDS)
  },
  11: {
    label: '5.13',
    score: getScoreForSort('5.13', GradeScales.YDS)
  },
  12: {
    label: '5.14',
    score: getScoreForSort('5.14', GradeScales.YDS)
  },
  13: {
    label: '5.15',
    score: getScoreForSort('5.15', GradeScales.YDS)
  }
}

export const BOULDER_DEFS: SliderMarksType =
{
  0: {
    score: -1,
    label: 'V-easy'
  },
  1: {
    score: getScoreForSort('v0', GradeScales.VSCALE),
    label: 'V0'
  },
  2: {
    score: getScoreForSort('v1', GradeScales.VSCALE),
    label: 'V1'
  },
  3: {
    label: 'V2',
    score: getScoreForSort('v2', GradeScales.VSCALE)
  },
  4: {
    label: 'V3',
    score: getScoreForSort('v3', GradeScales.VSCALE)
  },
  5: {
    label: 'V4',
    score: getScoreForSort('v4', GradeScales.VSCALE)
  },
  6: {
    label: 'V5',
    score: getScoreForSort('v5', GradeScales.VSCALE)
  },
  7: {
    label: 'V6',
    score: getScoreForSort('v6', GradeScales.VSCALE)
  },
  8: {
    label: 'V7',
    score: getScoreForSort('v7', GradeScales.VSCALE)
  },
  9: {
    label: 'V8',
    score: getScoreForSort('v8', GradeScales.VSCALE)
  },
  10: {
    label: 'V9',
    score: getScoreForSort('v9', GradeScales.VSCALE)
  },
  11: {
    label: 'V10',
    score: getScoreForSort('v10', GradeScales.VSCALE)
  },
  12: {
    label: 'V11',
    score: getScoreForSort('V11', GradeScales.VSCALE)
  },
  13: {
    label: 'V12',
    score: getScoreForSort('v12', GradeScales.VSCALE)
  },
  14: {
    label: 'V13+',
    score: getScoreForSort('v13+', GradeScales.VSCALE)
  }
}
