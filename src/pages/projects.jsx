import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import ProjectCard from "../components/projects/ProjectCard";
import Emoji from "../components/presentational/emoji";
import ExternalLink from "../components/presentational/externalLink";
import { PROFILE_LINKS } from "../helpers/constants";

const ProjectsPage = () => {
  const {
    allProjectsJson: { edges: projectsList},
  } = useStaticQuery(graphql`
    query {
      allProjectsJson {
        edges {
          node {
            id
            name
            period
            description
            links {
              live
              github
            }
            tags
            image {
              childImageSharp {
                gatsbyImageData(layout: FIXED, width: 352, height: 176, placeholder: BLURRED)
              }
            }
          }
        }
      }
    }
  `);

  return (
    <Layout>
      <SEO title="Projects" />
      <div className="projects-page">
        <h1 className="page-title">
          Projects
          <Emoji label="Laptop" emoji={" 💻 "} />
        </h1>
        <div className="projects-container">
          {projectsList.map(({node: project}) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <div className="banner">
          <p>
            The details are at&nbsp;
            <ExternalLink href={PROFILE_LINKS.github}>GitHub</ExternalLink>.
          </p>
          <p>
            Please come and see us anytime!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectsPage;
