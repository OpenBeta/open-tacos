import React from "react";
import LoginButton from "../components/ui/LoginButton";
import LogoutButton from "../components/ui/LogoutButton";
import Auth0Profile from "../components/ui/Auth0Profile";
import { Auth0Provider} from '@auth0/auth0-react';


function protectedtest() {  
  return (
    <Auth0Provider
    domain="dev-fmjy7n5n.us.auth0.com"
    clientId="0Eth3vOcH6IY75szP00kVQmQt8KhzZmL"
    redirectUri="https://localhost:8000/protectedtest"
    audience="https://dev-fmjy7n5n.us.auth0.com/api/v2/"
    scope="read:current_user update:current_user_metadata"
    >
      <div>
        <p>This is a protectedtest</p>
        <LoginButton></LoginButton>
        <LogoutButton></LogoutButton>
        <Auth0Profile></Auth0Profile>
      </div>
    </Auth0Provider>
  );
}

export default protectedtest;
