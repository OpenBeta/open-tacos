import React from "react";
import SingleStat from "./ui/SingleStat";
import BarPercent from "./ui/BarPercent";
import {computeClimbingPercentsAndColors} from "../js/utils";

function AreaStatistics ({climbs}) {
  const totalClimbsInArea = climbs.length;

  // If there are no climbs in an area do not render the stats
  if (totalClimbsInArea === 0) return null;

  const {percents, colors} = computeClimbingPercentsAndColors(climbs);
  return (
    <table className="table-auto mx-auto">
      <tbody>
        <tr >
          <td className="px-3.5">
          <SingleStat number={totalClimbsInArea} className="w-min"></SingleStat>
          </td>
          <td className="px-3.5 w-48">
            <BarPercent percents={percents} colors={colors}></BarPercent>
          </td>
        </tr>
      </tbody>
      <tfoot className="text-xs text-center text-gray-500">
        <tr>
          <th>Climbs</th>
          <th>Type</th>
        </tr>
      </tfoot>
    </table>
  );
}

export default AreaStatistics;