import React from "react";

export const Header = (props) => (
  <header {...props}>
    <h1 className="text-4xl font-bold font-sans tracking-tight my-4">{props.text}</h1>
  </header>
);
/**
 * <h1> short code to be used in templates
 */
export const h1 = (props) => (
  <h1 {...props} className="md-h1" />
);

export const h2 = (props) => (
  <h2 {...props} className="md-h2" />
);

export const p = (props) => <p {...props} className="md-p" />;

export const a = (props) => <a {...props} className="underline" />;

export const ul = (props) => (
  <ul {...props} className="list-inside list-disc" />
);

export const ol = (props) => (
  <ol {...props} className="list-inside list-decimal" />
);

export const blockquote =(props) => (<blockquote {...props} className="border-l-4 border-gray-200 pl-6 my-6"/>)


export const pre = (props) => (<pre {...props} className="font-mono text-sm rounded-xl bg-yellow-50 p-4"/>)