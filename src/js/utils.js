import { ClimbTypeToColor } from "./constants";

/**
 * Given a path or parent id and the type of the page generate the GitHub URL
 * @param {String} pathOrParentId from createNodeField in gatsby-node.js
 * @param {String} fileName the file name of the markdown file without extension
 */
export const pathOrParentIdToGitHubLink = (pathOrParentId, fileName) => {
  const baseUrl =
    "https://github.com/OpenBeta/opentacos-content/blob/develop/content/";
  return baseUrl + pathOrParentId + `/${fileName}.md`;
};

/**
 * Given an array of objects that are climbs, generate the percents
 * and colors of all the types of climbs. This is used in the BarPercent
 * component.
 * @param {Object[]} climbs, these are the nodes {frontmatter, fields} format
 * @returns {percents: [], colors:[]}
 */
export const computeClimbingPercentsAndColors = (climbs) => {
  const typeToCount = {};
  climbs.forEach((climb) => {
    const { type } = climb.frontmatter;
    const types = Object.keys(type);
    types.forEach((key) => {
      const isType = type[key];
      if (!isType) return;
      if (typeToCount[key]) {
        typeToCount[key] = typeToCount[key] + 1;
      } else {
        typeToCount[key] = 1;
      }
    });
  });
  const counts = Object.values(typeToCount) || [];
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const totalClimbs = counts.reduce(reducer, 0);
  const percents = counts.map((count) => {
    return (count / totalClimbs) * 100;
  });
  const colors = Object.keys(typeToCount).map((key) => {
    return ClimbTypeToColor[key];
  });
  return {
    percents,
    colors,
  };
};

/**
 * Given a set of climbs, map them back to their parent areas. For each
 * parent area compute the percents and colors for all of the types of climbs
 * within the area.
 * @param {Object[]} climbs - These are the values within the frontmatter object
 * @returns Object
 */
export const computeStatsBarPercentPerAreaFromClimbs = (climbs) => {
  const areasToClimbs = {};
  const areasToPercentAndColors = {};

  // map each climb to the area
  climbs.edges.map(({ node }) => {
    const parentId = node.fields.parentId;
    if (areasToClimbs[parentId]) {
      areasToClimbs[parentId].push(node.frontmatter);
    } else {
      areasToClimbs[parentId] = [node.frontmatter];
    }
  });

  // compute the stats and percent per area
  // do a little formatting to  reuse the helper function
  Object.keys(areasToClimbs).map((key) => {
    const formatted = areasToClimbs[key].map((c) => {
      return {
        node: {
          frontmatter: c,
        },
      };
    });
    areasToPercentAndColors[key] = computeClimbingPercentsAndColors(formatted);
  });

  return areasToPercentAndColors;
};

/**
 * Remove leading (6) or (aa) from an area or climb name
 * @param {String} s
 */
export const sanitize_name = (s) =>
  s.replace(/^(\(.{1,3}\) *)|((\d?[1-9]|[1-9]0)-)/, "");

/**
 * Simplify climb 'type' dictionary to contain only 'true' key-value pair.
 * @example {sport: true, boulder: false, trad: false} => {sport: true}
 * @param  type Climb type key-value dictionary
 */
export const simplify_climb_type_json = (type) => {
  if (!type) return {};
  for (const key in type) {
    if (type[key] === false) {
      delete type[key];
    }
  }
  return type;
};

/**
 * Temporary grade sort until helper lib is available.
 *
 * Calculate a number score for the YDS scale to make it easier to sort
 * 10x number + 2 for each letter + 1 for a slash grade or +
 *
 * 5.11a = 112 // 110 for 11, 2 for "a"
 * 5.11b/c = 113 // 110 for 11, 4 for "b", 1 for "/b"
 * 5.9+ = 91 // 90 for 9, 0 for the letter & 1 for "+"
 * @param {string} yds
 * @returns
 */
export const getScoreForYdsGrade = (yds) => {
  const regex = /^5\.([0-9]{1,2})([a-zA-Z])?([\/\+])?([a-zA-Z]?)/;
  const [match, num, firstLetter, plusOrSlash] = yds.match(regex);

  // If there isn't a match sort it to the bottom
  if (!match) {
    console.warning(`Unexpected yds format: ${yds}`);
    return 0;
  }

  let letterScore = firstLetter
    ? (firstLetter.toLowerCase().charCodeAt(0) - 96) * 2
    : 0;
  let plusSlash = plusOrSlash === undefined ? 0 : 1;
  return num * 10 + letterScore + plusSlash;
};
