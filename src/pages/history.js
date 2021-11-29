import React, { useEffect, useState } from "react";
import ReactPlaceholder from "react-placeholder";
import { TextBlock, TextRow } from "react-placeholder/lib/placeholders";

import { GithubClient } from "../js/GithubClient";
import RTable from "../components/RTable";
import { Commit, transform } from "../components/dashboard/EditHistory";
import SEO from "../components/seo";
import Layout from "../components/layout";

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
      const list = await github.getAllCommits();
      setLoading(false);
      setCommits(transform(list));
    };
    git_api_async();
  }, []);

  const labels = [
    {
      label: "Age"
    },
    {
      label: "Description",
      data: (row) => row['message'],
    },
    {
      label: "Author",
      data: (row => row['name'])
    },
    {
      label: "Detail",
      data: ()=> 'Github',
      url: (row) => row['html_url']
    }
  ]

  return (
    <Layout>
      {/* eslint-disable react/jsx-pascal-case */}
      <SEO
        keywords={[`openbeta`, `rock climbing`, `climbing api`]}
        title="History"
      />


      <div className="mt-12">
        <div className="md-h1">Recent edits</div>
        <RTable labels={labels} list={commits} />
        <table className="w-full history-table table-auto">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="w-16">No.</th>
              <th>Age</th>
              <th>Description</th>
              <th>Author</th>
            </tr>
          </thead>
          <tbody>
            <ReactPlaceholder
              ready={!loading}
              customPlaceholder={<RowPlaceholder />}
            >
              {commits.map((entry, index) => (
                <Commit key={entry.sha} index={index + 1} {...entry} />
              ))}
            </ReactPlaceholder>
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export const RowPlaceholder = (props) => (
  <tr>
    <td>
      <TextRow color="#f2f2f2" />
    </td>
    <td>
      <TextBlock rows={2} color="#f2f2f2" />
    </td>
    <td>
      <TextBlock rows={4} color="#f2f2f2" />
    </td>
    <td>
      <TextRow color="#f2f2f2" />
    </td>
  </tr>
);

export default History;
