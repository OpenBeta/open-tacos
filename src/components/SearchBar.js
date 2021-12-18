import React, { useState, useEffect } from "react";
import { navigate } from "gatsby";

import ClimbSearch from "./ClimbSearch";
import { IconButton } from "./ui/Button";
import SearchIcon from "../assets/icons/search.svg";

const slugify = require("slugify");

export default function SearchBar({ className }) {
  const [activated, setActivated] = useState(false);
  //const [isTop, setTop] = useState(false);
  useEffect(() => {
    detect_scroll() ;
  }, []);

  const detect_scroll = () => {
    window.addEventListener(
      "scroll",
      function () {
        if (!activated) return;
        // or window.addEventListener("scroll"....
        var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
        if (st > 200) {
          //setTop(false);
          setActivated(false);
        } else {
          //setTop(true);
          setActivated(true);
        }
      },
      false
    );
  };
  return (
    <div className={className}>
      {activated ? (
        <ClimbSearch onClimbNameChange={navigateTo} />
      ) : (
        <div
          className="cursor-pointer flex items-center rounded-3xl border-2 h-8"
          onClick={() => setActivated(!activated)}
        >
          <div className="font-light text-sm text-gray-400 pl-4">Search</div>
          <IconButton className="bg-red-500 w-6 h-6 rounded-full ml-14 mr-1">
            <SearchIcon className="text-white" />
          </IconButton>
        </div>
      )}
    </div>
  );
}

const navigateTo = (data) => {
  const { meta_mp_route_id } = data;
  navigate(build_url(meta_mp_route_id));
};

const build_url = (meta_mp_route_id) => {
  return `/climbs/${meta_mp_route_id}`;
};
