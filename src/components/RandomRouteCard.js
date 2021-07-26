import React from "react";
import Card from "./ui/card";
import RouteTypeChips from "./ui/RouteTypeChips";
import RouteGradeChip from "./ui/RouteGradeChip";
import { navigate } from "gatsby-link";

function RandomRouteCard({climb}) {
  if (!climb) return null;
  const {type, route_name, safety, yds} = climb.frontmatter;
  const {parentId, slug} = climb.fields;
  const numberOfAreas = parentId.split('/').length;
  const lastArea = parentId.split('/')[numberOfAreas-1];
  return (
    <Card
      onPress={()=>{navigate(slug)}}
    >
      <div className="text-left">
        <h2
          className="font-medium font-bold font-sans my-0.5 text-base truncate"
        >
          {route_name}
        </h2>
        <h3 className="display-inline italic my-0.5 truncate">{lastArea}</h3>
        <div className="my-0.5">
          <RouteGradeChip yds={yds} safety={safety}></RouteGradeChip>
          <RouteTypeChips type={type}></RouteTypeChips>
        </div>
      </div>
    </Card>
  )
}

export default RandomRouteCard;