import slugify from "slugify";

/**
 * TODO: I know this is a duplicated function in gatsby-node.js
 * Don't know the best way to share files across the build step and runtime code.
 * This will take a path 
 * i.g. USA/Nevada/Southern Nevada/Red Rock/16-Black Velvet Canyon/Black Velvet Wall
 * and split it into all possible paths
 * USA/Nevada/Southern Nevada/Red Rock/16-Black Velvet Canyon/Black Velvet Wall
 * USA/Nevada/Southern Nevada/Red Rock/16-Black Velvet Canyon/
 * USA/Nevada/Southern Nevada/Red Rock/
 * USA/Nevada/Southern Nevada/
 * etc...
 * 
 * @param {String} pathId is a POSIX path with / delimiters
 * @returns {Array} returns all the possible paths. The highest root level
 * path will be the first element in the array i.g. ["USA","USA/Nevada",etc...]
 */
 export const pathIdToAllPossibleParentPaths = (pathId) => {
  const allPossiblePaths = [];
  const splitPathId = pathId.split('/');
  const totalNumberOfPossiblePaths = splitPathId.length;

  let runningPath = [];
  for(let index = 0; index < totalNumberOfPossiblePaths; index++) {
    let currentPath = splitPathId[index];
    runningPath.push(currentPath);
    allPossiblePaths.push(runningPath.join('/'));
  }
  
  return allPossiblePaths;
};

/**
 * Given the parentAreas and the all possible parent paths generate a lookup
 * table to map the possible parent paths to the navigation path. 
 * These navigation paths will be passed into the navigate function call from
 * gatsby.
 * @param {string} pathId 
 * @param {String[]} parentAreas 
 * @returns returns an object of the following format
 * {
 *   USA : 'areas/<legacy_id>/USA'
 *   USA : null, // null if there is no possible navigation path
 *   etc...
 *   'USA/Nevada/Southern Nevada/Red Rock/16-Black Velvet Canyon/Black Velvet Wall': 'areas/<legacy_id>/black-velvet-wall'
 * }
 */
export const createNavigatePaths = (pathId, parentAreas) => {
  const allPossibleParentPaths = pathIdToAllPossibleParentPaths(pathId);
  const navigationPaths = {};

  if (!parentAreas || parentAreas.length === 0) {
    return navigationPaths;
  }

  // initialize all the paths with null
  allPossibleParentPaths.forEach((possiblePath)=>{
    navigationPaths[possiblePath] = null
  });

  for ( const {node} of parentAreas) {
    const currentPathId = node.fields.pathId;
    const legacy_id = node.frontmatter.metadata.legacy_id;
    const sluggedAreaName = slugify(node.frontmatter.area_name, {lower:true});
    navigationPaths[currentPathId] = `/areas/${legacy_id}/${sluggedAreaName}`;    
  }

  return navigationPaths;
};