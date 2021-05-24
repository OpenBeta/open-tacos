import PropTypes from "prop-types";
import React from "react";

import Header from "./header";

function Layout({ children }) {
  return (
    // <div className="flex flex-col min-h-screen font-sans text-gray-900">
    <div className="min-h-screen font-sans text-gray-900">
      <Header />

      <main className="w-full max-w-4xl mx-auto md:px-8 md:py-20">
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
