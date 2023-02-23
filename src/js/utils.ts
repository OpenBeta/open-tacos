import { ClimbTypeToColor } from './constants'
import { formatDistanceToNowStrict, differenceInYears, format } from 'date-fns'

import { ClimbType, ClimbDisciplineRecord, ClimbDiscipline } from './types'

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
export const computeClimbingPercentsAndColors = (climbs: ClimbType[]): PercentAndColor => {
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
  s.replace(/^(\(.{1,3}\) *)|((\d?[1-9]|[1-9]0)[:])|[a-zA-Z]{1,2}\./, '')

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

export const getSlug = (areaID: string, isLeaf: boolean, childAreasCount: number = -1): string => {
  const type = isLeaf || childAreasCount === 0 ? 'crag' : 'areas'
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
 * Only does format validation, does not check against database
 * or anything like that.
 *
 * @param uid
 * @returns true if has valid format
 */
export const checkUsername = (uid: string): boolean => {
  return uid != null && uid.length <= 30 &&
  !regUsernameKeywords.test(uid) &&
  regUsername.test(uid)
}

/**
 * Website URL validation and correction.
 * Websites are validated with the URL function.
 * Upon the first failure, a prefix of https:// will be added and the function will be called again.
 * On the second failure null is returned.
 *
 * @param url
 * @returns a potentially altered valid url if immediately possible, null otherwise
 */
export const checkWebsiteUrl = (url: string | null | undefined, allowRetest?: boolean): string | null => {
  if (typeof url !== 'string') return null

  try {
    const test = new URL(url)

    // We disallow arbitrary protocols, only allow https.
    if (test.protocol !== 'https:') {
      return null // disallow arbitrary protocols
    }

    return test.href
  } catch {
    // Endless recurse prevention
    if (allowRetest !== false) {
      // Try again with https prepended.
      const reTest = checkWebsiteUrl('https://' + url, false)
      if (reTest !== null) {
        return reTest
      }
    }

    return null
  }
}

/**
 *
 * @param dateUploaded
 * @returns string formatted like "9 days ago, 4 months ago, 8 seconds ago, etc."
 */
export const getUploadDateSummary = (dateUploaded: Date): string => {
  dateUploaded = new Date(dateUploaded)
  const currentTime = new Date()
  if (differenceInYears(currentTime, dateUploaded) >= 1) {
    return format(dateUploaded, 'MMM yyyy')
  }
  return formatDistanceToNowStrict(dateUploaded, { addSuffix: true })
}

/**
 *
 * @param type
 * @param dest
 * @returns url for the given destination type (area or climb) and destination uid
 */
export const urlResolver = (type: number, dest: string|null): string | null => {
  if (dest == null) return null
  switch (type) {
    case 0:
      return `/climbs/${dest}`
    case 1:
      return `/crag/${dest}`
    case 3:
      return `/u/${dest}`
    default:
      return null
  }
}

/**
 * Create a Google Maps link from latitude and longitude
 */
export const getMapHref = ({ lat, lng }: { lat: number, lng: number}): string => {
  return `https://www.google.com/maps/place/${lat},${lng}`
}

/**
 * Sort climb list by its left to right index
 * @param climbs  array of climbs
 * @returns sorted array
 */
export const sortClimbsByLeftRightIndex = (climbs: ClimbType[]): ClimbType[] => climbs.slice().sort(compareFn)

const compareFn = (a: ClimbType, b: ClimbType): number => (a.metadata.leftRightIndex - b.metadata.leftRightIndex)

/**
 * Remove __typename from climb disciplines object.  See https://github.com/apollographql/apollo-client/issues/1913
 * @param discplines
 * @returns disciplines object without __typename if exists
 */
export const removeTypenameFromDisciplines = (discplines: ClimbDisciplineRecord): ClimbDisciplineRecord => {
  const omitTypename = (key: string, value: boolean): boolean | undefined => (key === '__typename' ? undefined : value)
  return JSON.parse(JSON.stringify(discplines), omitTypename)
}
