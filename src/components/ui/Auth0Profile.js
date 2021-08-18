import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Auth0Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const callApi = async () => {
    const domain = "dev-fmjy7n5n.us.auth0.com";
    try {
      const accessToken = await getAccessTokenSilently({
        audience: `https://${domain}/api/v2/`,
        scope: "read:current_user",
      });

      console.log(accessToken);
      const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;

      const metadataResponse = await fetch(userDetailsByIdUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const res = await metadataResponse.json();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <h3>User Metadata</h3>
        <button
          onClick={callApi} 
        >
          Ping API
        </button>
      </div>
    )
  );
};

export default Auth0Profile;