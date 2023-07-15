import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";

const IndexPage = () => (
    <Layout isHomePage>
        <SEO title="Xio's blog"/>
        <div className="home-page">
            {/*<p className="greeting">{grretByTimeOfDay()}</p>*/}
            <h1 className="intro">XIO</h1>
            <p className="tagline">
                A Growing Developer.
            </p>
            {/*<Navigation isHomePage />*/}
        </div>
    </Layout>
);

export default IndexPage;
