import { getScoreForSort, isVScale, GradeScales } from '@openbeta/sandbag'

/**
 * Convert grade to band index
 * @param grade yds or v scale
 * @param scale GradeScales.VScale | GradeScales.Yds
 * @returns GradeBand
 */
export const getBandIndex = (grade: string): number => {
  const isV = isVScale(grade)

  if (isV) {
    const score = getScoreForSort(grade, GradeScales.VScale)
    return vScoreToBandIndex(score)
  }
  const score = getScoreForSort(grade, GradeScales.Yds)
  return ysdScoreToBandIndex(score)
}

const ysdScoreToBandIndex = (score: number): number =>
  score < 54
    ? 0
    : score < 67.5
      ? 1
      : score < 82.5
        ? 2
        : 3

const vScoreToBandIndex = (score: number): number =>
  score < 50 // v0
    ? 0
    : score < 60 // v1 - v2
      ? 1
      : score < 72 // v3 - v6
        ? 1
        : 3
