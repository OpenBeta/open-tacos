import React from "react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import Auth0Profile from "./Auth0Profile";
import LoginMessage from "./LoginMessage";

const Auth0NavBar = () => {
  return (
    <div className="flex justify-between items-center">
      <Auth0Profile/>
      <LoginMessage/>
      <div>
        <LoginButton/>
        <LogoutButton/>
      </div>
    </div>
  );
};

export default Auth0NavBar;