import { CountByGroupType } from '../../../js/types'
import { getScoreForGrade } from '../../../js/utils'
import { peach, pink } from '../../colors'
const vColor = peach
const ydsColor = pink
const ydsBucket = [
  {
    score: getScoreForGrade('5.10-'),
    label: '<5.10',
    color: ydsColor[0]
  },
  {
    score: getScoreForGrade('5.11-'),
    label: '5.10',
    color: ydsColor[1]
  },
  {
    score: getScoreForGrade('5.12-'),
    label: '5.11',
    color: ydsColor[2]
  },
  {
    score: getScoreForGrade('5.13-'),
    label: '5.12',
    color: ydsColor[3]
  },
  {
    score: getScoreForGrade('5.14-'),
    label: '5.13',
    color: ydsColor[4]
  },
  {
    score: getScoreForGrade('5.20'),
    label: '>5.14',
    color: ydsColor[5]
  }
]

const vScaleBucket = [
  {
    score: getScoreForGrade('V2'),
    label: '<V2',
    color: vColor[0]
  },
  {
    score: getScoreForGrade('V5'),
    label: 'V2-5',
    color: vColor[1]
  },
  {
    score: getScoreForGrade('V8'),
    label: 'V5-8',
    color: vColor[2]
  },
  {
    score: getScoreForGrade('V12'),
    label: 'V8-12',
    color: vColor[3]
  },
  {
    score: getScoreForGrade('V20'),
    label: '>V12',
    color: vColor[4]
  }
]

interface GradeGraphType {
  grades: CountByGroupType[]
  total: number
  bucketType: BucketType
  maxHeight?: number
  width?: number
}

type BucketType = 'v-scale' | 'yds'

const GradeGraph = ({
  grades,
  bucketType,
  maxHeight = 30,
  width = 30
}: GradeGraphType): JSX.Element => {
  const buckets = bucketType === 'yds' ? ydsBucket : vScaleBucket
  let maxBucketSize = 0
  const bars = grades
    .filter(g => !isNaN(g.count) || g.label !== 'NaN') // filter out some bad data
    .reduce((bucketCounts: number[], g: CountByGroupType): number[] => {
      let index = buckets.findIndex(b => b.score > getScoreForGrade(g.label))
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
