export const ClimbTypeToColor = {
  sport: "indigo-400",
  trad: "red-700",
  boulder: "green-700",
  tr: "yellow-400"
};

// Complains about SSR render, need to check for window object
export const Auth0Config = {
  domain: "dev-fmjy7n5n.us.auth0.com",
  clientId: "0Eth3vOcH6IY75szP00kVQmQt8KhzZmL",
  redirectUri: typeof window !== "undefined" ? window.location.origin + '/edit' : 'ran in node.js',
  audience: "https://dev-fmjy7n5n.us.auth0.com/api/v2/",
  scope: "read:current_user update:current_user_metadata"
};