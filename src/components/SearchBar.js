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
        <div className="flex items-center rounded-3xl border-2 h-12" onClick={() => setActivated(!activated)}>
          <div className="font-light text-sm text-gray-500 pl-5">Search</div><IconButton className="bg-red-500 w-8 h-8 rounded-full ml-14 mr-2">
            <SearchIcon className="text-white"/>
          </IconButton>
        </div>
      )}
    </div>
  );
}
