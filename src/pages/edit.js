import React from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import Editor from "../components/editor/Editor";
import Auth0NavBar from "../components/auth0NavBar/auth0NavBar";

const edit = () =>  (
    <Layout>
      <SEO keywords={[`openbeta`, `rock climbing`, `open data`]} title="Edit" />
      <Auth0NavBar />
      <Editor />
    </Layout>
  );

export default withAuthenticationRequired(edit);
