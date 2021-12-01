import React, { useEffect, useState } from "react";

import { GithubClient } from "../js/GithubClient";
import { transform } from "../components/dashboard/EditHistory";
import SEO from "../components/seo";
import Layout from "../components/layout";
import ChangeHistory from "../components/ChangeHistory";

/**
 * Show recent edits
 */
const History = (props) => {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const git_api_async = async () => {
      setLoading(true);
      const github = new GithubClient({});
      try {
        const list = await github.getAllCommits();
        setLoading(false);
        setCommits(transform(list));
      } catch (e) {
        setLoading(false);
        console.log("# Network error", e);
      }
    };
    git_api_async();
  }, []);


  return (
    <Layout layoutClz="layout-wide">
      {/* eslint-disable react/jsx-pascal-case */}
      <SEO
        keywords={[`openbeta`, `rock climbing`, `climbing api`]}
        title="History"
      />
      <div className="mt-12">
        <div className="md-h1">Recent edits</div>
        <ChangeHistory commits={commits} loading={loading}/>
      </div>
    </Layout>
  );
};

export default History;
