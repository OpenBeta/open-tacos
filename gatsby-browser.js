import "./src/styles/global.css";

import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import { navigate } from "gatsby";

const onRedirectCallback = (appState) => {
  // Use Gatsby's navigate method to replace the url
  navigate(appState?.returnTo || "/", { replace: true });
};

export const wrapRootElement = ({ element }) => {
  return (
    <Auth0Provider
      domain="dev-fmjy7n5n.us.auth0.com"
      clientId="0Eth3vOcH6IY75szP00kVQmQt8KhzZmL"
      redirectUri="https://localhost:8000/edit"
      audience="https://dev-fmjy7n5n.us.auth0.com/api/v2/"
      scope="read:current_user update:current_user_metadata"
      onRedirectCallback={onRedirectCallback}
    >
      {element}
    </Auth0Provider>
  );
};
