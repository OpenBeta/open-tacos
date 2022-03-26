import Slider, { SliderProps } from 'rc-slider'
import 'rc-slider/assets/index.css'

export interface RangeSliderProps {
  onChange: Function
}

const handleStyle = {
  width: '1.25rem',
  height: '1.25rem',
  marginTop: '-0.5rem',
  borderColor: 'rgb(30 41 59)',
  opacity: 1,
  backgroundColor: 'rgb(241 245 249)'
}

const RangeSlider = (props: Partial<SliderProps>): JSX.Element => (
  <Slider
    range
    {...props}
    trackStyle={[{ backgroundColor: 'rgb(30 41 59)' }
    ]}
    activeDotStyle={{ borderColor: 'rgb(30 41 59)', backgroundColor: '#fafafa' }}
    handleStyle={handleStyle}
  />
)

export default RangeSlider
