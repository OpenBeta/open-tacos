import { saveAs } from 'file-saver'
import { ClimbTypeToColor } from './constants'
import { Climb, ClimbDisciplineRecord, ClimbDiscipline } from './types'

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
  s.replace(/^(\(.{1,3}\) *)|((\d?[1-9]|[1-9]0)[-:])|[a-zA-Z]{1,2}\./, '')

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

export const getSlug = (areaID: string, isLeaf: boolean): string => {
  const type = isLeaf ? 'crag' : 'areas'
  return `/${type}/${areaID}`
}

function debouncePromise (fn: Function, time: number): any {
  let timerId: ReturnType<typeof setTimeout>

  return async function debounced (...args) {
    clearTimeout(timerId)

    return await new Promise((resolve) => {
      timerId = setTimeout(() => resolve(fn(...args)), time)
    })
  }
}

export const debounced = debouncePromise(async (items: object[]): Promise<object[]> => await Promise.resolve(items), 300)

/**
 * Convert array of disciplines ['trad', 'sport'] => {trad: true, sport: true}
 * @param types
 * @returns ClimbDisciplineRecord
 */
export const disciplineArrayToObj = (types: ClimbDiscipline[]): Partial<ClimbDisciplineRecord> => {
  // use Array.reduce() because ts-jest doesn't support for..of
  const z: Partial<ClimbDisciplineRecord> = types.reduce((acc, curr) => {
    acc[curr] = true
    return acc
  }, {})
  return z
}

const regUsername = /^[a-zA-Z0-9]+([_\\.-]?[a-zA-Z0-9])*$/i
const regUsernameKeywords = /openbeta|0penbeta|admin/i

/**
 * Username validation
 * @param uid
 * @returns true if has valid format
 */
export const checkUsername = (uid: string): boolean =>
  uid != null && uid.length <= 20 &&
  !regUsernameKeywords.test(uid) &&
  regUsername.test(uid)

export const saveAsFile = (data: any, filename: string): void => {
  const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
  saveAs(blob, filename)
}
