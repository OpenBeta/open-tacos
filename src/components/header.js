import { Link } from "gatsby";
import React, { useState } from "react";
import TacoIcon from "../assets/icons/taco.svg";
import SearchBar from "../components/SearchBar";

function Header() {
  const [isExpanded, toggleExpansion] = useState(false);
  return (
    <header
      className={`fixed top-0 z-50 border-b w-full ${
        isExpanded ? "bg-gray-50 border-b-2 border-black filter drop-shadow-md" : "bg-white"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between max-w-screen-2xl p-4 lg:py-2 mx-auto">
        <div className="flex flex-nowrap items-center">
          <Link to="/">
            <TacoIcon className="animate-pulse" />
          </Link>
          <SearchBar className="ml-4" />
        </div>
        <button
          className="items-center block px-3 py-2 text-black border border-white rounded lg:hidden"
          onClick={() => toggleExpansion(!isExpanded)}
        >
          <svg
            className="w-3 h-3 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
        <nav
          className={`text-2xl lg:text-sm ${
            isExpanded ? `block mt-4 divide-y` : `hidden`
          } lg:flex lg:justify-end w-full lg:w-auto`}
        >
          {[
            {
              route: `/dashboard`,
              title: `Dashboard`,
            },
            {
              route: `/about`,
              title: `About`,
            },
            {
              route: `/history`,
              title: `History`,
            },
            {
              route: `/export`,
              title: `Export`,
            },
          ].map((link) => (
            <Link
              className="block no-underline lg:py-4 lg:inline-block lg:px-4 py-4 lg:py-0"
              key={link.title}
              to={link.route}
            >
              {link.title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
