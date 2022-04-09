import RangeSlider from './RangeSlider'
import { BOULDER_DEFS } from '../../js/grades/ranges'

export { BOULDER_DEFS }

const BoulderRangeSlider = ({ onChange, defaultValue }): JSX.Element => {
  return (
    <RangeSlider
      count={1}
      step={1}
      dots
      marks={BOULDER_DEFS}
      min={0}
      max={13}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  )
}
export default BoulderRangeSlider
