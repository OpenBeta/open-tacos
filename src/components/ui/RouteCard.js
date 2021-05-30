import React from "react";
import Card from './card';
import Chip from "./Chip";

function RouteCard({route_name, type, safety, YDS, onPress}) {
  return (
    <Card
      onPress={onPress}
    >
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
          {type && type.trad && <Chip type="trad" />}
          {type && type.sport && <Chip type="sport" />}
          {type && type.tr && <Chip type="tr" />}
          {type && type.boulder && <Chip type="boulder" />}
        </div>
      </div>
    </Card>
  );
}

export default RouteCard;