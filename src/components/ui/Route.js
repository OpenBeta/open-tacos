// original card.js file. Leaving this as is to refactor into components

import React from "react";
import { Link } from "gatsby";
// import { IconButton } from "./Button";
// import LinkIcon from "../..//assets/icons/link.svg";
const slugify = require("slugify");

export default function Card({
  isGrid,
  isStandalone,
  fa,
  description,
  protection,
  YDS,
  location,
  route_name,
  type,
  safety,
  metadata,
  parent_slug,
}) {
  const { parent_sector } = metadata;

  const singleUrl = `/climbs/${metadata.mp_route_id}/${slugify(route_name, {
    lower: true,
  })}`;
  return (
    <div
      className={`card rounded-lg ${
        isGrid ? "cursor-pointer hover:bg-yellow-50" : ""
      } ${isStandalone ? "boder-0" : "border"}`}
    >
      <div className={`${isStandalone ? "px-5" : "m-5"}`}>
        {!isGrid && (
          <div className="flex justify-between items-center">
            <div>
              {parent_slug && (
                <span className="bg-gray-50 font-light text-sm text-gray-500 -ml-5 pl-2 pr-2 py-1">
                  <Link to={parent_slug} className="underline">
                    {parent_sector}
                  </Link>
                  &nbsp;&rarr;
                </span>
              )}
            </div>
            <div className="font-light text-sm text-gray-700">{fa}</div>
          </div>
        )}
        <h2
          className={`font-medium font-sans my-4 ${
            isGrid ? "text-base truncate" : "text-xl"
          }`}
        >
          {route_name}
        </h2>
        <div className="mt-4 flex justify-between items-center">
          <div>
            <span className="text-sm text-white font-mono bg-gray-700 rounded py-1.5 px-2 mr-4">
              {YDS}
              {safety && ` ${safety}`}
            </span>
            {type.trad && <Chip type="trad" />}
            {type.sport && <Chip type="sport" />}
          </div>
          <div>
            {!isGrid && !isStandalone && (
              <span className="font-light text-xs text-gray-900">
                <Link to={singleUrl} className="underline">
                  Single page view
                </Link>
              </span>
            )}
          </div>
        </div>

        {!isGrid && (
          <div className={`text-sm font-light font-mono text-gray-700 mt-8`}>
            <p>{description}</p>
            <p className="mt-2">
              Duis enamel pin locavore tousled lo-fi veniam nisi thundercats
              anim. Activated charcoal +1 air plant tacos, put a bird on it
              aliquip raclette mustache offal cillum whatever. Cupidatat
              crucifix fugiat, vaporware banh mi irure helvetica coloring book
              gluten-free pabst kombucha health goth adaptogen.
            </p>
          </div>
        )}
        {!isGrid && (
          <>
            <p className="font-semibold font-mono text-base text-gray-400 mt-6">
              Location
            </p>
            <div className="font-light font-mono  text-sm text-gray-700">
              <p>{location}</p>
            </div>
            <p className="font-semibold font-mono text-base text-gray-400 mt-6">
              Protection
            </p>
            <div className="font-light font-mono text-sm text-gray-700">
              <p>
                {protection} {type.trad}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const ChipType = {
  sport: "border-indigo-400",
  trad: "border-red-700",
};

function Chip({ type }) {
  return (
    <span
      className={`font-extralight font-mono rounded py-1 mr-4 px-2 text-xs uppercase border-2 ${ChipType[type]}`}
    >
      {type}
    </span>
  );
}
