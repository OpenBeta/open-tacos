import React, { useEffect } from 'react';
import Layout from "../components/layout";
import SEO from "../components/seo";
import Editor from "../components/editor/Editor";
import Auth0NavBar from '../components/auth0NavBar/auth0NavBar';
import { Auth0Provider} from '@auth0/auth0-react';

const edit = (props) => {
  const query = window.location.search;
  
  if (query.includes("file=")) {
    window.localStorage.setItem('previousPath', window.location.href);
  }

  useEffect(async () => {
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {      
      const href = window.localStorage.getItem('previousPath');
      window.location.href = href;
    }
  });

  return (
    <Auth0Provider
    domain="dev-fmjy7n5n.us.auth0.com"
    clientId="0Eth3vOcH6IY75szP00kVQmQt8KhzZmL"
    redirectUri="https://localhost:8000/edit"
    audience="https://dev-fmjy7n5n.us.auth0.com/api/v2/"
    scope="read:current_user update:current_user_metadata"
    >
    <Layout>
      <SEO
        keywords={[`openbeta`, `rock climbing`, `open data`]}
        title="Edit"
      />

      <Auth0NavBar/>
      <Editor/>
    </Layout>
    </Auth0Provider>
  );
};

export default edit;
