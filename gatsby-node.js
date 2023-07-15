const path = require('path');

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions;

    // Markdown 데이터를 가져오는 GraphQL 쿼리
    const result = await graphql(`
    query {
      allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
        edges {
          node {
            frontmatter {
              slug
              title
            }
          }
          previous {
            frontmatter {
              slug
              title
            }
          }
          next {
            frontmatter {
              slug
              title
            }
          }
        }
      }
    }
  `);

    const posts = result.data.allMarkdownRemark.edges;

    // 각 Markdown 파일에 대한 페이지 생성
    posts.forEach(({ node, previous, next }) => {
        createPage({
            path: `/articles/${node.frontmatter.slug}`, // 페이지 경로 설정
            component: path.resolve('./src/components/blog/ArticleTemplate.jsx'), // 사용할 페이지 템플릿 파일 경로 설정
            context: {
                slug: node.frontmatter.slug, // 페이지 컨텍스트로 slug 전달
                title: node.frontmatter.title, // 페이지 컨텍스트로 title 전달
                previousSlug: previous ? previous.frontmatter.slug : null, // 이전 게시물의 slug 전달
                previousTitle: previous ? previous.frontmatter.title : null, // 이전 게시물의 title 전달
                nextSlug: next ? next.frontmatter.slug : null, // 다음 게시물의 slug 전달
                nextTitle: next ? next.frontmatter.title : null, // 다음 게시물의 title 전달
            },
        });
    });
};
