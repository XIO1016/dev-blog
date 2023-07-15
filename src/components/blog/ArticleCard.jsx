import React from "react";
import {GatsbyImage, getImage} from "gatsby-plugin-image";
import Tags from "../presentational/tags";
import ExternalLink from "../presentational/externalLink";
import {FaExternalLinkAlt, FaGithub} from "react-icons/fa";
import "./index.scss";
import {Link} from "gatsby";


// <div key={node.frontmatter.title}>
//     {node.frontmatter.img !== null ?
//         <img src={require(`../../static/images/${node.frontmatter.img}`).default}
//              alt={node.frontmatter.img}/> :
//         <img src={require(`../../static/images/${node.frontmatter.category}.png`).default}
//              alt={node.frontmatter.img}/>}
//     <h2>{node.frontmatter.title}</h2>
//     <p>{node.frontmatter.description}</p>
//     {/* 추가적인 필드들을 렌더링합니다. */}
// </div>
const ArticleCard = ({
                         article: {
                             title,
                             description,
                             category,
                             slug,
                             date,
                             img,
                             author,
                             visibility
                         },
                     }) => (
    visibility === true ?
        <Link to={`/articles/${slug}`} className="card article-card">
            <div key={slug}>
                <div className="article-card__image-container">
                    {img !== null ?
                        <img src={require(`../../../static/images/${img}`).default}
                             alt={img} className="article-card__image"/> :
                        <img src={require(`../../../static/images/${category}.png`).default}
                             alt={img} className="article-card__image"/>}
                </div>
                <div className="article-card__details">
                    <div className="article-card__title-wrapper">
                        <h4 className="article-card__title">
                            {title}
                        </h4>
                        <div className="article-card__category">
                            {category}
                        </div>
                    </div>
                    <p className="article-card__period">{date}</p>
                    <p className="article-card__description">{description}</p>
                </div>
            </div>
        </Link> : <></>

);

export default ArticleCard;
