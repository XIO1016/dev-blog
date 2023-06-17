import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import { grretByTimeOfDay } from "../helpers/utils";
import Navigation from "../components/navigation";

const IndexPage = () => (
  <Layout isHomePage>
    <SEO title="Xio's blog" />
    <div className="home-page">
      <p className="greeting">{grretByTimeOfDay()}</p>
      <h1 className="intro">I'm Xio</h1>
      <p className="tagline">
        A Growing Developer.
      </p>
      <Navigation isHomePage />
    </div>
  </Layout>
);

export default IndexPage;
