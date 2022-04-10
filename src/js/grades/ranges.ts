// ****************************************************
// Constants and util functions for grade ranges
// ****************************************************

import { YDS_DEFS, SliderMarksType } from './rangeDefs'

export { YDS_DEFS }
export type { SliderMarksType }

export interface GradeRangeType {
  scores: number[]
  labels: string[]
}

/**
 * Transform rc-slider range [minIndex, maxIndex] to
 * ```
 * {
 *   scores: [minScore, maxScore],
 *   labels: [minScore, maxScore]
 * }
 * ```
 * @param range [minIndex, maxIndex]
 * @param gradeDefs rc-slider marks array
 * @returns GradeRangeType
 */
export const rangeTransformer = (range: [number, number], gradeDefs: SliderMarksType): GradeRangeType => ({
  scores: [gradeDefs[range[0]].score, gradeDefs[range[1]].score],
  labels: [gradeDefs[range[0]].label, gradeDefs[range[1]].label]
})

/**
 *
 * @returns Return selected labels in order to not overcrowding the slider
 */
export const genSliderMarks = (): any => {
  // Warning: not a deep clone. we simply copy over keys
  const defs = Object.assign({}, YDS_DEFS)
  for (const key of Object.keys(defs)) {
    defs[key] = { ...YDS_DEFS[key] } // a hack to copy values
    if (!['0', '3', '6', '7', '9', '11', '13'].includes(key)) {
      if (defs?.[key] !== undefined) { defs[key].label = '' }
    }
  }
  defs[0].label = '3rd'
  return defs
}
