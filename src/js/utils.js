import { ClimbTypeToColor } from './constants'

/**
 * Given a path or parent id and the type of the page generate the GitHub URL
 * @param {String} pathOrParentId from createNodeField in gatsby-node.js
 * @param {String} fileName the file name of the markdown file without extension
 */
export const pathOrParentIdToGitHubLink = (pathOrParentId, fileName) => {
  const baseUrl =
    'https://github.com/OpenBeta/opentacos-content/blob/develop/content/'
  return baseUrl + pathOrParentId + `/${fileName}.md`
}

/**
 * Given an array of objects that are climbs, generate the percents
 * and colors of all the types of climbs. This is used in the BarPercent
 * component.
 * @param {Object[]} climbs, these are the nodes {frontmatter, fields} format
 * @returns {percents: [], colors:[]}
 */
export const computeClimbingPercentsAndColors = (climbs) => {
  const typeToCount = {}
  climbs.forEach((climb) => {
    const { type } = climb.frontmatter
    const types = Object.keys(type)
    types.forEach((key) => {
      const isType = type[key]
      if (!isType) return
      if (typeToCount[key]) {
        typeToCount[key] = typeToCount[key] + 1
      } else {
        typeToCount[key] = 1
      }
    })
  })
  const counts = Object.values(typeToCount) || []
  const reducer = (accumulator, currentValue) => accumulator + currentValue
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
 */
export const computeStatsBarPercentPerAreaFromClimbs = (climbs) => {
  const areasToClimbs = {}
  const areasToPercentAndColors = {}

  // map each climb to the area
  climbs.edges.forEach(({ node }) => {
    const parentId = node.fields.parentId
    if (areasToClimbs[parentId]) {
      areasToClimbs[parentId].push(node.frontmatter)
    } else {
      areasToClimbs[parentId] = [node.frontmatter]
    }
  })

  // compute the stats and percent per area
  // do a little formatting to  reuse the helper function
  Object.keys(areasToClimbs).forEach((key) => {
    const formatted = areasToClimbs[key].map((c) => {
      return {
        node: {
          frontmatter: c
        }
      }
    })
    areasToPercentAndColors[key] = computeClimbingPercentsAndColors(formatted)
  })

  return areasToPercentAndColors
}

/**
 * Remove leading (6) or (aa) from an area or climb name
 * @param {String} s
 */
export const sanitizeName = (s) =>
  s.replace(/^(\(.{1,3}\) *)|((\d?[1-9]|[1-9]0)-)/, '')

/**
 * Simplify climb 'type' dictionary to contain only 'true' key-value pair.
 * @example {sport: true, boulder: false, trad: false} => {sport: true}
 * @param  type Climb type key-value dictionary
 */
export const simplifyClimbTypeJson = (type) => {
  if (!type) return {}
  for (const key in type) {
    if (type[key] === false) {
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
export const getScoreForGrade = (grade) => {
  const ypsRegex = /^5\.([0-9]{1,2})([a-zA-Z])?([/+])?([/-])?([a-zA-Z]?)/
  const vGradeRegex = /^V([0-9]{1,2})([/+])?([/-])?([0-9]{1,2})?/
  const vGradeIrregular = /^V-([a-zA-Z]*)/
  const isYds = grade.match(ypsRegex)
  const isVGrade = grade.match(vGradeRegex) || grade.match(vGradeIrregular)

  // If there isn't a match sort it to the bottom
  if (!isVGrade && !isYds) {
    console.warn(`Unexpected grade format: ${grade}`)
    return 0
  }
  if (isYds) {
    return getScoreForYdsGrade(isYds)
  }
  if (isVGrade) {
    return getScoreForVGrade(grade.match(vGradeRegex), grade.match(vGradeIrregular))
  }
}

const getScoreForVGrade = (match, irregularMatch) => {
  let score = 0
  if (match) {
    const [_, num, hasPlus, hasMinus, secondNumber] = match // eslint-disable-line no-unused-vars
    const minus = (hasMinus && !secondNumber) ? -1 : 0 // check minus is not a V1-2
    const plus = (hasMinus && secondNumber) || hasPlus ? 1 : 0 // grade V1+ the same as V1-2
    score = (parseInt(num, 10) + 1) * 10 + minus + plus // V0 = 10, leave room for V-easy to be below 0
  } else if (irregularMatch) {
    const [_, group] = irregularMatch // eslint-disable-line no-unused-vars
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

const getScoreForYdsGrade = (match) => {
  const [_, num, firstLetter, plusOrSlash, hasMinus] = match // eslint-disable-line no-unused-vars
  const letterScore = firstLetter
    ? (firstLetter.toLowerCase().charCodeAt(0) - 96) * 2
    : 0
  const plusSlash = plusOrSlash === undefined ? 0 : 1
  const minus = hasMinus ? -1 : 0

  return parseInt(num, 10) * 10 + letterScore + plusSlash + minus
}
