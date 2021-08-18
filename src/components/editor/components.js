import React from "react";
import ReactDOM from "react-dom";

import LinkIcon from "../../assets/icons/link.svg";

export const IconBold = (props) => (
  <span className="font-base text-2xl">B</span>
);

export const IconItalic = (props) => (
  <span className="font-base text-2xl italic">I</span>
);

export const IconUnderline = (props) => (
  <span className="font-base text-2xl underline">U</span>
);

export const IconCode = (props) => (
  <span className="font-base  text-xl">&lt;&gt;</span>
);

export const IconURL = (props) => (
  <span>
    <LinkIcon />
  </span>
);

export const IconH1 = (props) => (
  <span className="text-center font-base text-xl w-6 py-10">H1</span>
);

export const IconH2 = (props) => (
  <span className="text-center font-base text-xl w-6 py-10">H2</span>
);
