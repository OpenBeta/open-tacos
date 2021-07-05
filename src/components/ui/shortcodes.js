import React from "react";

export const Header = (props) => (
  <header {...props}>
    <h1 className="text-4xl font-bold font-sans my-4">{props.text}</h1>
  </header>
);
/**
 * <h1> short code to be used in templates
 */
export const h1 = (props) => (
  <h1 {...props} className="text-3xl font-medium mt-8 mb-1" />
);

export const h2 = (props) => (
  <h2 {...props} className="text-xl font-bold mt-8 mb-1" />
);

export const p = (props) => <p {...props} className="my-4" />;

export const a = (props) => <a {...props} className="underline" />;

export const ul = (props) => (
  <ul {...props} className="list-inside list-disc" />
);

export const ol = (props) => (
  <ol {...props} className="list-inside list-decimal" />
);

export const blockquote =(props) => (<blockquote {...props} className="border-l-4 border-gray-200 pl-6"/>)


export const pre = (props) => (<pre {...props} className="font-mono text-sm rounded-xl bg-yellow-50 p-4"/>)