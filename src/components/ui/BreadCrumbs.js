import React from "react";
import { Link } from "gatsby";
const slugify = require("slugify");

/**
 * Turn each element of `pathTokens` to a gatsby-link.
 *
 * Example:
 * ```
 * pathTokens = ["USA", "Nevada", "Area 51", "Ladder1"]
 * isClimbPage = true
 *   => USA / Nevada / Area 51
 * isClimbPage = false
 *   => USA / Nevada / Area 51 / Ladder1
 * ```
 * @param {{pathTokens:string[], isClimbPage:boolean}} Props component props
 */
function BreadCrumbs({ pathTokens, isClimbPage }) {
  const tokens = isClimbPage
    ? pathTokens.slice(0, pathTokens.length - 1)
    : pathTokens;
  // tokens.unshift("Home"); // Append 'Home' to the front
  return (
    <div>
      <Link className="hover:underline hover:text-gray-900 text-gray-400 " to="/">
        <b>Home</b>
      </Link>
      {tokens.map((place, index, array) => {
        const isLastElement = array.length - 1 === index;
        const url = "/" + slugify_path(array.slice(0, index + 1));
        return (
          <span key={index}>
            <span className="text-gray-400 mx-1.5">/</span>
            {isLastElement && !isClimbPage ? (
              <span className="">{place}</span>
            ) : (
              <span className="text-gray-400">
                <Link className="hover:underline hover:text-gray-900" to={url}>
                  {place}
                </Link>
              </span>
            )}
            {/* {!isLastElement && <span className="text-gray-400 mx-1.5">/</span>} */}
          </span>
        );
      })}
    </div>
  );
}

const slugify_path = (pathTokens) =>
  pathTokens.map((s) => slugify(s, { lower: true, strict: true })).join("/");

export default BreadCrumbs;
