import React, { useState } from "react";
import ClimbSearch from "./ClimbSearch";
import { IconButton } from "./ui/Button";
import SearchIcon from "../assets/icons/search.svg";

export default function SearchBar({className}) {
  const [activated, setActivated] = useState(false);
  return (
    <div className={className}>
      {activated ? (
        <ClimbSearch />
      ) : (
        <div className="flex items-center rounded-3xl border-2 h-8" onClick={() => setActivated(!activated)}>
          <div className="font-light text-sm text-gray-400 pl-4">Search</div><IconButton className="bg-red-500 w-6 h-6 rounded-full ml-14 mr-1">
            <SearchIcon className="text-white"/>
          </IconButton>
        </div>
      )}
    </div>
  );
}
