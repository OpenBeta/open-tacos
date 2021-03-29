import React from "react";
import { LabelMap } from "./TypeLabels";

export default function SuggestionEntry({ suggestion }) {
  const { name, yds, type, meta_parent_sector, fa } = suggestion;
  const fa_txt = fa && "UNKNOWN" === fa.toUpperCase() ? "FA unknown" : fa;
  return (
    <div className="suggestion">
      <div className="suggestion-fa">{fa_txt}</div>
      <div className="suggestion-main">
        <div>
          <strong>{name}</strong> {yds}
        </div>
        <LabelMap types={type} />
      </div>
      <div className="suggestion-location">{meta_parent_sector}</div>
    </div>
  );
}
