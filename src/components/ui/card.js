import React from "react";
import PropTypes from "prop-types";

export default function Card({
  isGrid,
  fa,
  description,
  protection,
  YDS,
  location,
  route_name,
  type,
  safety,
}) {
  //const desc = isGrid ? truncate(description, 100, "...") : description;
  return (
    <div className="">
      <div className="card border rounded-lg">
        <div className="m-5">
          {!isGrid && (
            <div className="flex flex-wrap justify-end">
              <div></div>
              <div className="font-light text-sm text-gray-700">{fa}</div>
            </div>
          )}
          <h2 className={`font-medium font-sans my-4 ${isGrid? 'text-base truncate' : 'text-xl'}`}>{route_name}</h2>
          <div className="mt-4">
            <span className="text-sm text-white font-mono bg-gray-700 rounded py-1.5 px-2 mr-4">
              {YDS}
              {safety && ` ${safety}`}
            </span>
            {type.trad && <Chip type="trad" />}
            {type.sport && <Chip type="sport" />}
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
              <p className="font-semibold text-base text-gray-400 mt-6">
                Location
              </p>
              <div className="font-light font-sans  text-sm text-gray-700">
                <p>{location}</p>
              </div>
              <p className="font-semibold text-base text-gray-400 mt-6">
                Protection
              </p>
              <div className="font-light font-sans  text-sm text-gray-700">
                <p>
                  {protection} {type.trad}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

//const truncate = (str, max, suffix) => str.length < max ? str : `${str.substr(0, str.substr(0, max - suffix.length).lastIndexOf(' '))}${suffix}`;

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
Chip.propTypes = {
  type: PropTypes.string,
};

Card.propTypes = {
  isGrid: PropTypes.bool,
  fa: PropTypes.string,
  description: PropTypes.array,
  protection: PropTypes.array,
  YDS: PropTypes.string,
  location: PropTypes.array,
  route_name: PropTypes.string,
  type: PropTypes.object,
  safety: PropTypes.string,
};
