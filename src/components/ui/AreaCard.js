import React from "react";
import Card from './card';
import BarPercent from "./BarPercent";

function AreaCard({area_name, onPress, stats}) {
  return (
    <Card
      onPress={onPress}
      footer={
        stats && 
        <BarPercent styles="-mt-2" percents={stats.percents} colors={stats.colors}></BarPercent>
      }
    >
      <h2
        className="font-medium font-sans my-4 text-base truncate"
      >
        {area_name}
      </h2>
    </Card>
  );
}

export default AreaCard;