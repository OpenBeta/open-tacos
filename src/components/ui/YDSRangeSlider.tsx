import RangeSlider from './RangeSlider'
import { YDS_DEFS, rangeTransformer, genSliderMarks } from '../../js/grades/ranges'

export { YDS_DEFS }

const YDSRangeSlider = ({ onChange, defaultValue }): JSX.Element => {
  return (
    <RangeSlider
      count={1}
      step={1}
      dots
      marks={genSliderMarks()}
      min={0}
      max={13}
      defaultValue={defaultValue}
      onChange={(range: [number, number]) => onChange(rangeTransformer(range, YDS_DEFS))}
    />
  )
}
export default YDSRangeSlider
