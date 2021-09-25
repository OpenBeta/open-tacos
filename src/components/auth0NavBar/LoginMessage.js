import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginMessage = () => {
  const { isAuthenticated } = useAuth0();
  return !isAuthenticated && (
    <div>
      To edit this file, please login through Auth0
    </div>
  );
};

export default LoginMessage;