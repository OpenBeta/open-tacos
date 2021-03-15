import React, { PureComponent } from "react";
import { BarChart, Bar } from "recharts";

const data = [
  {
    name: "Page A",
    uv: 800,
  },
  {
    name: "Page B",
    uv: 800,
  },
  {
    name: "Page C",
    uv: 1030,
  },
  {
    name: "Page D",
    uv: 1400,
  },
  {
    name: "Page E",
    uv: 1890,
  },
  {
    name: "Page F",
    uv: 1240,
  },
  {
    name: "Page G",
    uv: 1200,
  },
  {
    name: "Page H",
    uv: 1000,
  },
  {
    name: "Page J",
    uv: 800,
  },
];

export default class GradeDistribution extends PureComponent {
  render() {
    return (
      <BarChart width={80} height={35} data={data}>
        <Bar dataKey="uv" fill="#8884d8" barSize={6}/>
      </BarChart>
    );
  }
}
