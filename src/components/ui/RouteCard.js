import React from "react";
import Card from './Card';
import Chip from "./Chip";

function RouteCard({children, route_name, type, safety, YDS}) {
  return (
    <Card>
      <h2
        className="font-medium font-sans my-4 text-base truncate"
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
        </div>
    </Card>
  );
}

export default RouteCard;