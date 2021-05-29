import React from "react";
import {navigate} from "gatsby";

function BreadCrumbs({path, navigationPaths}) {
  const entries = navigationPaths ? Object.entries(navigationPaths) : [];
  return (
    <div>{
      path.split("/").map((place, index, array)=>{
        const isLastElement = array.length - 1 === index;
        const possibleNavigation = entries[index];
        const navigationPath = possibleNavigation && 
          possibleNavigation.length > 0 ? possibleNavigation[1] : null;
        return (
          <span 
            key={index}
            className={!isLastElement ? 'text-gray-400' : 'text-gray-700'}>
            <span
              onClick={()=>{navigationPath && navigate(navigationPath)}} 
              className="hover:underline cursor-pointer hover:text-gray-900">
              {place} 
            </span>
            {!isLastElement && <span className="mx-1.5">/</span>}
          </span>
        )
      })
    }</div>
  );
}

export default BreadCrumbs;