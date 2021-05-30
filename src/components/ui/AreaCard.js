import React from "react";
import Card from './card';

function AreaCard({area_name, onPress}) {
  return (
    <Card
      onPress={onPress}
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