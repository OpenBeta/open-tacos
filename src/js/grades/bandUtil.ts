import { getScoreForSort, isVScale, GradeScales } from '@openbeta/sandbag'

/**
 * Convert grade to band index
 * @param grade yds or v scale
 * @param scale GradeScales.VSCALE | GradeScales.YDS
 * @returns GradeBand
 */
export const getBandIndex = (grade: string): number => {
  const isV = isVScale(grade)

  if (isV) {
    const score = getScoreForSort(grade, GradeScales.VSCALE)
    return vScoreToBandIndex(score)
  }
  const score = getScoreForSort(grade, GradeScales.YDS)
  return freeScoreToBandIndex(score)
}

export const freeScoreToBandIndex = (score: number): number =>
  score < 54
    ? 0
    : score < 67.5
      ? 1
      : score < 82.5
        ? 2
        : 3

export const vScoreToBandIndex = (score: number): number =>
  score < 50 // v0
    ? 0
    : score < 60 // v1 - v2
      ? 1
      : score < 72 // v3 - v6
        ? 1
        : 3

export const BAND_BY_INDEX = [
  'beginner', 'intermediate', 'advanced', 'expert'
]
