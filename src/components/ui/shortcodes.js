import React from "react";

/**
 * <h1> short code to be used in templates
 */
export const h1 = (props) => <h1 {...props} className="text-2xl font-medium mt-8 mb-1"/>;

export const h2 = (props) => <h2  {...props} className="text-xl font-normal mt-8 mb-1"/>

export const p = (props) => <p {...props} className="my-4"/>;

export const a = (props) => <a {...props} className="underline"/>;

export const ul = (props) => <ul {...props} className="list-inside list-disc"/>;

export const ol = (props) => <ol {...props} className="list-inside list-decimal"/>;
