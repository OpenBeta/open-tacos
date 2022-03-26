import RangeSlider from './RangeSlider'
import { YDS_DEFS, genSliderMarks } from '../../js/grades/ranges'

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
      onChange={onChange}
    />
  )
}
export default YDSRangeSlider
