import React from "react";
import PropTypes from "prop-types";

export default function Card({
  fa,
  description,
  protection,
  YDS,
  location,
  route_name,
  type,
}) {
  return (
    <div className="container md mx-auto">
      <div className="card cursor-pointer border border-gray-300 rounded">
        <div className="m-5">
          <div className="flex flex-wrap justify-end">
            <div></div>
            <div className="font-light text-gray-700">{fa}</div>
          </div>
          <h2 className="text-xl font-medium font-sans my-4">{route_name}</h2>
          <div className="mt-4">
            <span className="text-lg text-white font-mono bg-green-700 rounded py-0.5 px-2">
              {YDS}
            </span>
          </div>
          <div className="font-light font-mono text-base text-gray-700 mt-8">
            <p>{description}</p>
            <p className="mt-2">
              Duis enamel pin locavore tousled lo-fi veniam nisi thundercats
              anim. Activated charcoal +1 air plant tacos, put a bird on it
              aliquip raclette mustache offal cillum whatever. Cupidatat
              crucifix fugiat, vaporware banh mi irure helvetica coloring book
              gluten-free pabst kombucha health goth adaptogen.
            </p>
          </div>
          <p className="font-semibold text-base text-gray-400 mt-6">Location</p>
          <div className="font-light font-mono text-base text-gray-700">
            <p>{location}</p>
          </div>
          <p className="font-semibold text-base text-gray-400 mt-6">
            Protection
          </p>
          <div className="font-light font-mono text-base text-gray-700">
            <p>
              {protection} {type.trad}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  fa: PropTypes.string,
  description: PropTypes.array,
  protection: PropTypes.array,
  YDS: PropTypes.string,
  location: PropTypes.array,
  route_name: PropTypes.string,
  type: PropTypes.object,
};
