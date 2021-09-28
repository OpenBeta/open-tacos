import React from "react";
import { navigate, Link } from "gatsby";
const slugify = require("slugify");

function BreadCrumbs({ path, navigationPaths }) {
  const entries = navigationPaths ? Object.entries(navigationPaths) : [];
  return (
    <div>
      {path.split("/").map((place, index, array) => {
        const isLastElement = array.length - 1 === index;
        const possibleNavigation = entries[index];
        const navigationPath =
          possibleNavigation && possibleNavigation.length > 0
            ? possibleNavigation[1]
            : null;

        // If the path is . it means it is at the root level. Add a empty
        // character for it still renders the BreadCrumbs element.
        const formattedPlace = place === "." ? "\u00A0" : place;
        return (
          <span
            key={index}
            className={!isLastElement ? "text-gray-400" : "text-gray-700"}
          >
            <span
              onClick={() => {
                navigationPath && navigate(navigationPath);
              }}
              className="hover:underline cursor-pointer hover:text-gray-900"
            >
              {formattedPlace}
            </span>
            {!isLastElement && <span className="mx-1.5">/</span>}
          </span>
        );
      })}
    </div>
  );
}

export function BreadCrumbs2({ pathTokens }) {
  //const entries = navigationPaths ? Object.entries(navigationPaths) : [];
  return (
    <div>
      {pathTokens.map((place, index, array) => {
        const isLastElement = pathTokens.length - 1 === index;

        // If the path is . it means it is at the root level. Add a empty
        // character for it still renders the BreadCrumbs element.
        const formattedPlace = place === "." ? "\u00A0" : place;
        const url = slugify_path(array.slice(0, index + 1));
        return (
          <span key={index}>
            {isLastElement ? (
              <span className="">{formattedPlace}</span>
            ) : (
              <span className="text-gray-400">
                <Link
                  className="hover:underline hover:text-gray-900"
                  to={`/${url}`}
                >
                  {formattedPlace}
                </Link>
                {<span className="mx-1.5">/</span>}
              </span>
            )}
            {/* {!isLastElement && <span className="mx-1.5">/</span>} */}
          </span>
        );
      })}
    </div>
  );
}

const slugify_path = (pathTokens) => {
  return pathTokens.map((s) => slugify(s, { lower: true })).join("/");
};

export default BreadCrumbs;
