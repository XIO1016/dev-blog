import React, {useEffect, useState} from "react";
import {useStaticQuery, graphql} from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import ProjectCard from "../components/projects/ProjectCard";
import Emoji from "../components/presentational/emoji";
import ArticleCard from "../components/blog/ArticleCard";
import CommonArticleCard from "../components/blog/CommonArticleCard";

const ProjectsPage = () => {
    const data = useStaticQuery(graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          frontmatter {
            title
            description
            category
            slug
            date
            img
            visibility
            main
          }
        }
      }
    }
  }
`);


    const blogsList = data.allMarkdownRemark.edges;
    const categories = new Set();
    const ALL = 'all';
    categories.add(ALL);

    const [currentCategory, setCurrentCategory] = useState(ALL);
    const handleCategoryClick = (c) => {
        setCurrentCategory(c);
    }

    useEffect(() => {
        if (currentCategory === ALL) {
            setFilteredPostsLength(blogsList.length);
        } else {
            setFilteredPostsLength(
                blogsList.filter(({node}) => node.frontmatter.category === currentCategory).length);
        }
    }, [currentCategory]);

    const mainList = blogsList.reduce((accumulator, {node}) => {
        if (node.frontmatter.main === true) {
            accumulator.push(node.frontmatter);
        }
        categories.add(node.frontmatter.category);
        return accumulator;
    }, []);

    const [filteredPostsLength, setFilteredPostsLength] = useState(blogsList.length);
    return (
        <Layout>
            <SEO title="Blog"/>
            <div className="blog-page">
                <h1 className="page-title">
                    Blog
                    <Emoji label="Writing Hand" emoji={" ✍🏻 "}/>
                </h1>
                <p>Here is the records I've been following.</p>
                <div className="projects-container">
                    {mainList.map((node) => (
                        <ArticleCard key={node.slug} article={node}/>
                    ))}
                </div>
                {/*<div className="projects-container">*/}
                {/*    {projectsList.map(({node: project}) => (*/}
                {/*        <ProjectCard key={project.id} project={project}/>*/}
                {/*    ))}*/}
                {/*</div>*/}

                <div className="common-projects-container">
                    <h2>{currentCategory.toUpperCase()} Posts ({filteredPostsLength})</h2>
                    <div className="category-wrapper">
                        {[...categories].map((c) => (<button
                            className={`category${currentCategory === c ? ' active' : ''}`}
                            onClick={() => handleCategoryClick(c)}
                        >{c}</button>))}
                    </div>
                    {blogsList.map(({node}) => (
                        <CommonArticleCard key={node.frontmatter.slug} article={node.frontmatter}
                                           currentCategory={currentCategory}/>
                    ))}
                </div>

            </div>
        </Layout>
    );
};

export default ProjectsPage;
