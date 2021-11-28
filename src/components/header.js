import { Link } from "gatsby";
import React, { useState } from "react";
import TacoIcon from "../assets/icons/taco.svg";
import SearchBar from "../components/SearchBar";

function Header() {
  const [isExpanded, toggleExpansion] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full bg-white border-b z-50">
      <div className="flex flex-nowrap items-center justify-between max-w-4xl mx-auto md:p-2">
        <div className="flex flex-nowrap items-center">
          <Link to="/">
            <TacoIcon className="animate-pulse" />
          </Link>

          <SearchBar className="ml-4"/>
        </div>
        <button
          className="items-center block px-3 py-2 text-black border border-white rounded md:hidden"
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
          className={`text-sm ${
            isExpanded ? `block` : `hidden`
          } md:block md:items-center w-full md:w-auto`}
        >
          {[
            {
              route: `/dashboard`,
              title: `Dashboard`
            },
            {
              route: `/about`,
              title: `About`,
            },
            {
              route: `/history`,
              title: `History`,
            }

          ].map((link) => (
            <Link
              className="block mt-4 no-underline md:inline-block md:mt-0 md:ml-6"
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
