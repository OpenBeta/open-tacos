import React, { PureComponent } from "react";
import { BarChart, Bar, XAxis} from "recharts";

const data = [
  {
    name: "5.6",
    uv: 2,
  },
  {
    name: "5.7",
    uv: 0,
  },
  {
    name: "5.8",
    uv: 4,
  },
  {
    name: "5.9",
    uv: 10,
  },
  {
    name: "5.10",
    uv: 14,
  },
  {
    name: "5.11",
    uv: 12,
  },
  {
    name: "5.12",
    uv: 4,
  },
  {
    name: "5.13",
    uv: 2,
  }
];

export default class GradeDistribution extends PureComponent {
  render() {
    return (
      <div className="place-content-center">
        <BarChart width={160} height={60} data={data}>
          <Bar dataKey="uv" fill="#8884d8" barSize={6} />
          <XAxis dataKey="name"  renderCustomAxisTick tick={{fontSize: 8}} />
        </BarChart>
      </div>
    );
  }
}
