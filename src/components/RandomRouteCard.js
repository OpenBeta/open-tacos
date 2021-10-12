import React from "react";
import { Link } from "gatsby";
import Card from "./ui/card";
import RouteTypeChips from "./ui/RouteTypeChips";
import RouteGradeChip from "./ui/RouteGradeChip";

function RandomRouteCard({ climb }) {
  if (!climb) return null;
  const { slug, pathTokens } = climb;
  const { type, route_name, safety, yds } = climb.frontmatter;

  return (
    <Link to={slug}>
      <Card>
        <div className="text-left">
          <h2 className="font-medium font-bold font-sans my-0.5 text-base truncate">
            {route_name}
          </h2>
          <h3 className="display-inline italic my-0.5 truncate">
            {pathTokens[pathTokens.length - 2]}
          </h3>
          <div className="my-0.5">
            <RouteGradeChip yds={yds} safety={safety}></RouteGradeChip>
            <RouteTypeChips type={type}></RouteTypeChips>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default RandomRouteCard;
