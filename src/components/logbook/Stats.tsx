import { groupBy } from 'underscore'
import { formatDistanceToNowStrict, format, endOfDay, differenceInCalendarDays } from 'date-fns'
import { TickType } from '../../js/types'

const Stats: React.FC<{ tickList: TickType[]}> = ({ tickList }) => {
  const sortedList = tickList
  const total = tickList.length
  const totalTime = formatDistanceToNowStrict(sortedList[0].dateClimbed)

  const dayMap = groupBy(sortedList, getEndOfDay)
  const climbingDays = Object.keys(dayMap).length

  const longestStreak = calculateLongestStreak(sortedList)
  return (
    <div className='stats stats-vertical lg:stats-horizontal shadow my-12 mx-4 lg:mx-16'>

      <div className='stat place-items-center'>
        <div className='stat-title'>Total</div>
        <div className='stat-value'>{total}</div>
        <div className='stat-desc'>sends</div>

      </div>

      <div className='stat place-items-center'>
        <div className='stat-title'>Time</div>
        <div className='stat-value'>{totalTime}</div>
        <div className='stat-desc'>since {format(sortedList[0].dateClimbed, 'MMMM dd, yyyy')} </div>
      </div>

      <div className='stat place-items-center'>
        <div className='stat-title'>Climbing days</div>
        <div className='stat-value'>{climbingDays}</div>
        <div className='stat-desc'>&nbsp;</div>
      </div>

      <div className='stat place-items-center'>
        <div className='stat-title'>Longest streak</div>
        <div className='stat-value'>{longestStreak}</div>
        <div className='stat-desc'>consecutive days</div>
      </div>
    </div>
  )
}

export default Stats

const getEndOfDay = (entry: TickType): number => endOfDay(entry.dateClimbed).getTime()

export const calculateLongestStreak = (sortedList: TickType[]): number | null => {
  const streakSet = new Set<number>()
  let longestStreak: Date[] = []
  for (let i = 0; i < sortedList.length; i++) {
    const today = new Date(sortedList[i].dateClimbed)
    if (i === sortedList.length - 1) {
      longestStreak.push(today)
      break
    }
    const nextDay = sortedList[i + 1].dateClimbed
    if (differenceInCalendarDays(nextDay, today) === 1) {
      longestStreak.push(today)
    } else {
      if (longestStreak.length > 0) {
        streakSet.add(longestStreak.length + 1)
      }
      longestStreak = []
    }
  }
  const list = Array.from(streakSet.keys()).sort((a, b) => b - a)
  return list.length === 0 ? null : list[0]
}
