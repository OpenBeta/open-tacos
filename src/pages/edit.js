import React from "react";
import Layout from "../components/layout";
import SEO from "../components/seo";
import Editor from "../components/editor/Editor";

const edit = (props) => {
  return (
    <Layout>
      <SEO
        keywords={[`openbeta`, `rock climbing`, `open data`]}
        title="Edit"
      />
      <Editor/>
    </Layout>
  );
};

export default edit;
