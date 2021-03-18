import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { BarChart, Bar, XAxis } from "recharts";

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
  },
];

export default class GradeDistribution extends PureComponent {
  render() {
    return (
      //justify-items-center items-center
      <table className="table-auto">
        <tbody >
          <tr >
            <td className="px-3.5">
              <SingleStat num={32} />
            </td>
            <td className="px-3.5">
              <BarPercent />
            </td>
            <td className="px-3.5 pt-2">
              <BarChart width={160} height={60} data={data}>
                <Bar dataKey="uv" fill="#1f2937" barSize={6} />
                <XAxis
                  dataKey="name"
                  renderCustomAxisTick
                  tick={{ fontSize: 8 }}
                />
              </BarChart>
            </td>
          </tr>
        </tbody>
        <tfoot className="text-xs text-center text-gray-500">
          <tr>
            <th>Climbs</th>
            <th>Type</th>
            <th>Grade distribution</th>
          </tr>
        </tfoot>
      </table>
      // <div className="grid grid-cols-3 grid-rows-2 auto-cols-auto">
      //   <div className="place-self-center"><SingleStat num={32} /></div>
      //   <div className="place-items-center">
      //     <BarPercent />
      //   </div>
      //   <div className="mt-1">
      //     <BarChart width={160} height={60} data={data}>
      //       <Bar dataKey="uv" fill="#1f2937" barSize={6} />
      //       <XAxis dataKey="name" renderCustomAxisTick tick={{ fontSize: 8 }} />
      //     </BarChart>
      //   </div>

      //   <div className="text-xs text-center text-gray-700">Climbs</div>
      //   <div className="text-xs text-center text-gray-700">Type</div>

      //   <div className="text-xs text-center text-gray-700">
      //     Grade distribution
      //   </div>
      // </div>
    );
  }
}

const SingleStat = ({ num, className }) => {
  return (
    <div
      className={`h-12 flex place-items-center font-mono text-xl rounded-lg border-2 px-3 bg-gray-100 ${className}`}
    >
      {num}
    </div>
  );
};

SingleStat.propTypes = {
  num: PropTypes.number,
  className: PropTypes.string,
};

const BarPercent = () => {
  // const z = [
  //   {
  //     name: "Breakdown",
  //     sport: 20,
  //     trad: 80,
  //   },
  // ];
  return (
    <div className="h-2 w-100 flex">
      <span
        className="rounded-l h-2 bg-red-700 inline-block mr-1"
        style={{ width: "80px" }}
      ></span>
      <span
        className="rounded-r h-2 bg-indigo-400 inline-block"
        style={{ width: "20px" }}
      ></span>
    </div>
    // <BarChart
    //   width={160}
    //   height={80}
    //   data={z}
    //   layout="vertical"
    //   stackOffset="expand"
    // >
    //   <XAxis type="percent" dataKey=hide={false} />
    //   <YAxis type="category" dataKey="name" hide={true}  />

    //   <Bar dataKey="sport" fill="#1f2937" stackId="1" />
    //   <Bar dataKey="trad" fill="#82ca9d" stackId="1" />
    //   {/* <XAxis dataKey="name" renderCustomAxisTick tick={{ fontSize: 8 }} /> */}
    // </BarChart>
  );
};
