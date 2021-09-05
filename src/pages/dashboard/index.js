import React from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Layout from "../../components/layout";
import SEO from "../../components/seo";
import EditHistory from "../../components/dashboard/EditHistory";
function DashboardIndex() {
  return (
    <Layout customClz="flex flex-col justify-between h-screen" layoutClz="default-layout flex-grow">
      <SEO keywords={[]} title="Dashboard" />
      <EditHistory />
    </Layout>
  );
}

export default withAuthenticationRequired(DashboardIndex);
