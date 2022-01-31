import { ClimbTypeToColor } from './constants'
import { Climb, ClimbDisciplineRecord } from './types'

/**
 * Given a path or parent id and the type of the page generate the GitHub URL
 * @param {String} pathOrParentId from createNodeField in gatsby-node.js
 * @param {String} fileName the file name of the markdown file without extension
 */
export const pathOrParentIdToGitHubLink = (pathOrParentId: string, fileName: string): string => {
  const baseUrl =
    'https://github.com/OpenBeta/opentacos-content/blob/develop/content/'
  return `${baseUrl}${pathOrParentId}/${fileName}.md`
}
interface PercentAndColor {
  percents: number[]
  colors: string[]
}

/**
 * Given an array of objects that are climbs, generate the percents
 * and colors of all the types of climbs. This is used in the BarPercent
 * component.
 * @param {Object[]} climbs, these are the nodes {frontmatter, fields} format
 * @returns {percents: [], colors:[]}
 */
export const computeClimbingPercentsAndColors = (climbs: Climb[]): PercentAndColor => {
  const typeToCount: {[key: string]: number} = {}
  climbs.forEach((climb) => {
    const { type } = climb

    Object.entries(type).reduce<Record<string, number>>(
      (acc: {[key: string]: number}, [key, discipline]: [string, boolean]) => {
        if (!discipline) return acc
        if (acc[key] !== undefined) {
          acc[key] = acc[key] + 1
        } else {
          acc[key] = 1
        }
        return acc
      }, typeToCount)
  })
  const counts: number[] = Object.values(typeToCount)
  const reducer = (accumulator: number, currentValue: number): number => accumulator + currentValue
  const totalClimbs = counts.reduce(reducer, 0)
  const percents = counts.map((count) => {
    return (count / totalClimbs) * 100
  })
  const colors = Object.keys(typeToCount).map((key) => {
    return ClimbTypeToColor[key]
  })
  return {
    percents,
    colors
  }
}

/**
 * Given a set of climbs, map them back to their parent areas. For each
 * parent area compute the percents and colors for all of the types of climbs
 * within the area.
 * @param {Object[]} climbs - These are the values within the frontmatter object
 * @returns Object
//  */
// export const computeStatsBarPercentPerAreaFromClimbs = (climbs: Climb[]):Record<string, PercentAndColor> => {
//   const areasToClimbs = {}
//   const areasToPercentAndColors = {}

//   // map each climb to the area
//   climbs.forEach( climb => {
//     const parentId = climb.parent
//     if (areasToClimbs[parentId] !== undefined) {
//       areasToClimbs[parentId].push(node.frontmatter)
//     } else {
//       areasToClimbs[parentId] = [node.frontmatter]
//     }
//   })

//   // compute the stats and percent per area
//   // do a little formatting to  reuse the helper function
//   Object.keys(areasToClimbs).forEach((key) => {
//     const formatted = areasToClimbs[key].map((c) => {
//       return {
//         node: {
//           frontmatter: c
//         }
//       }
//     })
//     areasToPercentAndColors[key] = computeClimbingPercentsAndColors(formatted)
//   })

//   return areasToPercentAndColors
// }

/**
 * Remove leading (6) or (aa) from an area or climb name
 * @param {String} s
 */
export const sanitizeName = (s: string): string =>
  s.replace(/^(\(.{1,3}\) *)|((\d?[1-9]|[1-9]0)-)/, '')

/**
 * Simplify climb 'type' dictionary to contain only 'true' key-value pair.
 * @example {sport: true, boulder: false, trad: false} => {sport: true}
 * @param  type Climb type key-value dictionary
 */
export const simplifyClimbTypeJson = (type?: ClimbDisciplineRecord): {[key: string]: boolean} => {
  if (type === undefined) return {}
  for (const key in type) {
    if (type[key] === false) {
      /* eslint-disable @typescript-eslint/no-dynamic-delete */
      delete type[key]
    }
  }
  return type
}

/**
 * Temporary grade sort until helper lib is available.
 *
 * Calculate a number score for the YDS scale to make it easier to sort
 * 10x number + 2 for each letter + 1 for a slash grade or +
 *
 * 5.11a = 112 // 110 for 11, 2 for "a"
 * 5.11b/c = 113 // 110 for 11, 4 for "b", 1 for "/b"
 * 5.9+ = 91 // 90 for 9, 0 for the letter & 1 for "+"
 *
 * Bouldering starts at 1000
 * V-easy = 1000
 * V0 = 1012 // 1000
 *
 * @param {string} yds
 * @returns
 */
export const getScoreForGrade = (grade: string): number => {
  if (grade === null) { return 0 }
  const ypsRegex = /^5\.([0-9]{1,2})([a-zA-Z])?([/+])?([/-])?([a-zA-Z]?)/
  const vGradeRegex = /^V([0-9]{1,2})([/+])?([/-])?([0-9]{1,2})?/
  const vGradeIrregular = /^V-([a-zA-Z]*)/
  const isYds = grade.match(ypsRegex)
  const isVGrade = (grade.match(vGradeRegex) !== null) || grade.match(vGradeIrregular)

  // If there isn't a match sort it to the bottom
  if ((isVGrade === null) && (isYds === null)) {
    console.warn(`Unexpected grade format: ${grade}`)
    return 0
  }
  if (isYds !== null) {
    return getScoreForYdsGrade(isYds)
  }
  if (isVGrade !== null) {
    return getScoreForVGrade(grade.match(vGradeRegex), grade.match(vGradeIrregular))
  }
}

const getScoreForVGrade = (match: RegExpMatchArray, irregularMatch: RegExpMatchArray): number => {
  let score = 0
  if (match !== null) {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const [_, num, hasPlus, hasMinus, secondNumber] = match
    const minus = (hasMinus !== undefined && secondNumber === undefined) ? -1 : 0 // check minus is not a V1-2
    const plus = (hasMinus !== undefined && secondNumber !== undefined) || (hasPlus !== undefined) ? 1 : 0 // grade V1+ the same as V1-2
    score = (parseInt(num, 10) + 1) * 10 + minus + plus // V0 = 10, leave room for V-easy to be below 0
  } else if (irregularMatch !== null) {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const [_, group] = irregularMatch
    switch (group) {
      case 'easy':
        score = 1
        break
      default:
        score = 0
        break
    }
  }
  return score + 1000
}

const getScoreForYdsGrade = (match: RegExpMatchArray): number => {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [_, num, firstLetter, plusOrSlash, hasMinus] = match
  const letterScore = firstLetter !== undefined
    ? (firstLetter.toLowerCase().charCodeAt(0) - 96) * 2
    : 0
  const plusSlash = plusOrSlash === undefined ? 0 : 1
  const minus = hasMinus !== undefined ? -1 : 0

  return parseInt(num, 10) * 10 + letterScore + plusSlash + minus
}

export const getSlug = (areaId: string, isLeaf: boolean): string => {
  const type = isLeaf ? 'crag' : 'areas'
  return `/${type}/${areaId}`
}
