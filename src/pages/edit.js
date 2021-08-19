import React from "react";
import Layout from "../components/layout";
import SEO from "../components/seo";
import Editor from "../components/editor/Editor";

const edit = (props) => {
  return (
    <Layout
      layoutClz="layout-edit"
      customClz="bg-gradient-to-r from-pink-400 via-yellow-300 to-green-400"
    >
      <SEO keywords={[`openbeta`, `rock climbing`, `open data`]} title="Edit" />
      <Editor />
    </Layout>
  );
};

export default edit;
