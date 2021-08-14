import React from "react";
import Layout from "../components/layout";
import SEO from "../components/seo";
import Editor from "../components/editor/Editor";

export const edit = (props) => {
  return (
    <Layout>
      <SEO
        keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
        title="Home"
      />
      <Editor/>
    </Layout>
  );
};

export default edit;
