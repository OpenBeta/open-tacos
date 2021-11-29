import React from "react";

const RTable = ({ labels, list }) => {
  return (
    <table className="border-collapse w-full">
      <thead>
        <tr>
          {labels.map(({ label, data, url }) => {
            return (
              <th className="hidden lg:table-cell" key={label}>
                {label}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {list.map((row, index) => (
          <Row row={row} labels={labels} key={index} />
        ))}
      </tbody>
    </table>
  );
};

const Row = ({ row, labels, index }) => {
  return (
    <tr
      key={index}
      className="flex flex-col lg:table-row lg:even:bg-gray-100 mb-16 lg:mb-0"
    >
      {labels.map((col, colIndex) => {
        const { label, data, url } = col;
        const value = data ? data(row) : row[label.toLowerCase()];
        const link = url ? (
          <a
            href={url}
            className="cursor-pointer hover:text-custom-secondary underline "
            target="_blank"
            rel="noreferrer noopener"
          >
            {value}
          </a>
        ) : undefined;
        return (
          <td
            key={`row${index}-${colIndex}-${label}`}
            className="flex px-2 py-4 lg:px-0 lg:py-0 even:bg-gray-100 lg:even:bg-transparent lg:table-cell border lg:border-0"
          >
            <div className="w-1/4 lg:hidden">{label}</div>
            <div className="w-3/4">{link || value}</div>
          </td>
        );
      })}
    </tr>
  );
};

export default RTable;
