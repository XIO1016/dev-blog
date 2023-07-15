import React, {useEffect} from 'react';
import {graphql} from 'gatsby';
import Layout from "../layout";
import TableOfContents from "./TableOfContent";
import {siteMetadata} from "../../../gatsby-config";
import PrevNext from "./PrevNext";
import '../../styles/prism.css';

const ArticleTemplate = ({data, pageContext}) => {
    const {tableOfContents, frontmatter, html} = data.markdownRemark;
    const {previousSlug, nextSlug, previousTitle, nextTitle} = pageContext;

    useEffect(() => {
        console.log(frontmatter);
        console.log(data);
        console.log(previousSlug);
        console.log(previousTitle);
        console.log(nextSlug);
        console.log(nextTitle);
    }, [frontmatter, data, previousSlug, nextSlug]);

    return (
        <Layout>
            <div className="markdown-page__meta">
                <div className="markdown-page__date">{frontmatter.date}</div>
                <div className="markdown-page__title">{frontmatter.title}</div>
                <div className="markdown-page__author">
                    <img className="markdown-page__author-img" src={siteMetadata.img} alt="author_img"/>
                    <div>{frontmatter.author}</div>
                </div>
            </div>
            <div className="markdown-page">
                <div className="markdown-content">
                    <div dangerouslySetInnerHTML={{__html: html}}></div>
                </div>
                <TableOfContents html={html} tableOfContent={tableOfContents}/>
            </div>
            <PrevNext prev={previousSlug} next={nextSlug} prevTitle={previousTitle} nextTitle={nextTitle}/>
        </Layout>
    );
};

export const query = graphql`
  query ($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      tableOfContents
      frontmatter {
        title
        date
        author
      }
      html
    }
  }
`;

export default ArticleTemplate;
