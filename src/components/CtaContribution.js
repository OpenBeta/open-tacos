import React from "react";
import heroImage from "../images/lukas-schulz-n6uOlqYPMXY-unsplash.jpg";

function CtaContribution() {
  return (
    <div className="relative hero-card rounded-lg h-64 overflow-hidden">
      <img
        alt="Yosemite National Park"
        className="block mx-auto mb-8 rounded-lg opacity-40 absolute -top-20"
        src={heroImage}
      />
      <div className="absolute top-20 left-10 text-left">
        <span className="font-bold text-2xl text-gray-50">OpenTacos</span>
        <h1 className="text-5xl font-bold text-gray-50">
          Become a <span className="font-light">Contributor</span>
        </h1>
        <span className="text-gray-50 text-lg top-5 relative">
          collaborative climbing route catalog
        </span>
      </div>
    </div>
  );
}

export default CtaContribution;