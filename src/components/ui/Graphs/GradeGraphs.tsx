import { CountByGroupType } from '../../../js/types'
import { getScore, GradeScales, GradeScalesTypes } from '@openbeta/sandbag'
import { peach, pink } from '../../colors'

const vColor = peach
const ydsColor = pink
const ydsBucket = [
  {
    score: getScore('5.9+', GradeScales.YDS),
    label: '<5.10',
    color: ydsColor[0]
  },
  {
    score: getScore('5.10d', GradeScales.YDS),
    label: '5.10',
    color: ydsColor[1]
  },
  {
    score: getScore('5.11d', GradeScales.YDS),
    label: '5.11',
    color: ydsColor[2]
  },
  {
    score: getScore('5.12d', GradeScales.YDS),
    label: '5.12',
    color: ydsColor[3]
  },
  {
    score: getScore('5.13d', GradeScales.YDS),
    label: '5.13',
    color: ydsColor[4]
  },
  {
    score: getScore('5.17a', GradeScales.YDS),
    label: '>5.14',
    color: ydsColor[5]
  }
]

const vScaleBucket = [
  {
    score: getScore('V2', GradeScales.VSCALE),
    label: '<V2',
    color: vColor[0]
  },
  {
    score: getScore('V5', GradeScales.VSCALE),
    label: 'V2-5',
    color: vColor[1]
  },
  {
    score: getScore('V8', GradeScales.VSCALE),
    label: 'V5-8',
    color: vColor[2]
  },
  {
    score: getScore('V12', GradeScales.VSCALE),
    label: 'V8-12',
    color: vColor[3]
  },
  {
    score: getScore('V20', GradeScales.VSCALE),
    label: '>V12',
    color: vColor[4]
  }
]

interface GradeGraphType {
  grades: CountByGroupType[]
  total: number
  bucketType: GradeScalesTypes
  maxHeight?: number
  width?: number
}

const GradeGraph = ({
  grades,
  bucketType,
  maxHeight = 30,
  width = 30
}: GradeGraphType): JSX.Element => {
  const buckets = bucketType === GradeScales.YDS ? ydsBucket : vScaleBucket
  let maxBucketSize = 0
  const bars = grades
    .filter(g => !isNaN(g.count) || g.label !== 'NaN') // filter out some bad data
    .reduce((bucketCounts: number[], g: CountByGroupType): number[] => {
      let index = buckets.findIndex(b => b.score > getScore(g.label, bucketType))
      // if we dont' find it, it's above the range
      index = index < 0 ? buckets.length - 1 : index
      bucketCounts[index] = bucketCounts[index] !== undefined ? (bucketCounts[index] + g.count) : g.count
      // keep track of max bucket size
      maxBucketSize = bucketCounts[index] > maxBucketSize ? bucketCounts[index] : maxBucketSize
      return bucketCounts
    }, []).map((count: number, index: number) => {
      const height = count / maxBucketSize * maxHeight
      const { label, color } = buckets[index]
      return (
        <div key={`${label}_${count}`}>
          <div
            style={{ height, width, backgroundColor: color, marginBottom: '4px' }}
          />
          <div style={{ fontSize: '10px', transform: 'rotate(45deg)' }}>{label}</div>
        </div>
      )
    })
  return (
    <div className='flex items-baseline '>
      {bars}
    </div>
  )
}
export default GradeGraph
