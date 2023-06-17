/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

function SEO({
  description,
  lang,
  meta,
  title,
  canonicalUrl,
  isLargeSummary = false,
  image,
}) {
  const { site, profileImage } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            siteUrl
          }
        }
        profileImage: file(relativePath: { eq: "icon/logo.svg" }) {
          childImageSharp {
            fixed {
              src
            }
          }
        }
      }
    `
  );

  const metaDescription = description || site.siteMetadata.description;
  const linkProps = canonicalUrl
    ? {
        link: [
          {
            rel: "canonical",
            href: `${canonicalUrl}`,
          },
        ],
      }
    : {};

  const imagePath = `${site.siteMetadata.siteUrl}${
    image || profileImage.file
  }`;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      {...linkProps}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `og:image`,
          content: imagePath,
        },
        ...(isLargeSummary
          ? [
              {
                name: `og:image:width`,
                content: "800",
              },
              {
                name: `og:image:height`,
                content: "420",
              },
              {
                name: `twitter:image:width`,
                content: "800",
              },
              {
                name: `twitter:image:height`,
                content: "420",
              },
            ]
          : []),
      ].concat(meta)}
    />
  );
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
};

export default SEO;
