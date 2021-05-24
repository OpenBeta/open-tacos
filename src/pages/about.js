import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";

function AboutPage() {
  return (
    <Layout>
      {/* eslint-disable react/jsx-pascal-case */}
      <SEO
        keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
        title="About"
      />

      <section className="flex flex-col items-center md:flex-row">
        <div className="md:w-2/3 md:mr-8">
          <blockquote className="pl-4 font-serif leading-loose text-justify border-l-4 border-gray-900">
          When the pursuit of natural harmony is a shared journey, great heights can be attained.
          </blockquote>

          <cite className="block mt-4 text-xs font-bold text-right uppercase">
            – Lynn Hill
          </cite>
        </div>
      </section>
    </Layout>
  );
}

export default AboutPage;
