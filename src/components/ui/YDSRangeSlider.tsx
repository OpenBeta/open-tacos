import RangeSlider from './RangeSlider'

// const defaultValue = [0, 10]
const YDSRangeSlider = (props): JSX.Element => {
  return (
    <RangeSlider
      count={1}
      step={1}
      dots
      marks={YDS_DEFS}
      min={YDS_DEFS[0].value - 2}
      max={YDS_DEFS[YDS_DEFS.length - 1].value}
      defaultValue={[4, 10]}
      onChange={(e) => console.log(e)}
    />
  )
}
export default YDSRangeSlider

interface RangeEntryType {
  value: number
  label: string
  score: number // precalculated score for sorting/filtering
}

export const YDS_DEFS: RangeEntryType[] = [
  {
    value: 1,
    label: '4th',
    score: 5
  },
  {
    value: 2,
    label: '5.0',
    score: 5.5
  },
  {
    value: 3,
    label: '5.5',
    score: 33
  },
  {
    value: 4,
    label: '',
    score: 38
  },
  {
    value: 5,
    label: '',
    score: 43
  },
  {
    value: 6,
    label: '5.8',
    score: 48.5
  },
  {
    value: 7,
    label: '5.9',
    score: 54
  },
  {
    value: 8,
    label: '',
    score: 63.5
  },
  {
    value: 9,
    label: '5.11',
    score: 70.5
  },
  {
    value: 10,
    label: '',
    score: 77.5
  },
  {
    value: 11,
    label: '5.13',
    score: 85.5
  },
  {
    value: 12,
    label: '',
    score: 93.5
  },
  {
    value: 13,
    label: '5.15',
    score: 101.5
  }
]

const genSliderMarks = (): RangeEntryType[] => {
  const decimals: any[] = YDS_DEFS.reduce((acc: RangeEntryType[], item) => {
    if (['3rd', '5.0', '5.6', '5.10', '5.12', '5.14'].includes(item.label)) {
      acc.push(item)
    } else {
      acc.push({
        value: item.value,
        label: ''
      })
    }
    return acc
  }, [])
  return decimals
}
