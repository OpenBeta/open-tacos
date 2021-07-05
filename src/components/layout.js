import PropTypes from "prop-types";
import React from "react";
import { Location } from "@reach/router";

import Header from "./header";
import LandingHero from "./ui/LandingHero";

function Layout({ children }) {
  return (
    <div className="min-h-screen font-sans text-gray-900">
      <Header />

      {/* Only show hero on index page. We place it here instead of index.js
      in order to fill the whole screen (escaping main container's width).*/}
      <Location> 
        {({ location }) => location.pathname === "/" && <LandingHero />}
      </Location>

      <main className="w-full max-w-4xl mx-auto px-4 py-20 md:px-24 sm:px-8" >
        {children}
      </main>

      <footer className="bg-blue-700">
        <nav className="flex justify-between max-w-4xl p-4 mx-auto text-sm md:p-8">
          <p className="text-white">
            A project by {` `}
            <a
              className="font-bold no-underline"
              href="https://openbeta.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenBeta
            </a>
          </p>

          <p>
            <a
              className="font-bold text-white no-underline"
              href="https://github.com/OpenBeta/open-tacos"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </p>
        </nav>
      </footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
