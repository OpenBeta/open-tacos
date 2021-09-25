import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return ( !isAuthenticated && <button className="btn btn-success" onClick={() => loginWithRedirect()}>Log In</button>);
};

export default LoginButton;