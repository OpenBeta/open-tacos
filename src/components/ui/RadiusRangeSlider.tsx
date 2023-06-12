import RangeSlider from './RangeSlider'
import { RadiusRange } from '../../js/types'

/**
 * Range slider for radius filter
 */
export const RadiusRangeSlider = ({ onChange, defaultValue }): JSX.Element => {
  return (
    <RangeSlider
      step={null}
      marks={RADIUS_DEF}
      max={4}
      pushable={1} // enforce at least 1 range apart
      defaultValue={defaultValue}
      onChange={(range) =>
        onChange(sliderRangeToStore(range as number[]))}
    />
  )
}

export const prettifyLabel = (range: RadiusRange): string => {
  const [min, max] = range.rangeIndices
  if (min === 0 && max > min) {
    return `Within ${RADIUS_DEF[max].miles} miles`
  }
  return `${RADIUS_DEF[min].miles} - ${RADIUS_DEF[max].miles} miles`
}

export const sliderRangeToStore = (rangeIndices: number[]): RadiusRange => ({
  rangeMeters: [RADIUS_DEF[rangeIndices[0]].value,
    RADIUS_DEF[rangeIndices[1]].value],
  rangeIndices
})

export const radiusRangeToString = (range: RadiusRange): { min: string, max: string } => ({
  min: RADIUS_DEF[range.rangeIndices[0]].label,
  max: RADIUS_DEF[range.rangeIndices[1]].label
})

type RadiusDefType = Record<number, { label: string, value: number, miles: number }>

export const RADIUS_DEF: RadiusDefType = {
  0: {
    label: 'Center',
    value: 0,
    miles: 0
  },
  1: {
    label: '30 miles',
    value: 48000,
    miles: 30
  },
  2: {
    label: '60 miles',
    value: 96000,
    miles: 60
  },
  3: {
    label: '100 miles',
    value: 160000,
    miles: 100
  },
  4: {
    label: '150 miles',
    value: 240000,
    miles: 150
  }
}
