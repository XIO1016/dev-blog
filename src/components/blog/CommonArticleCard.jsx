import React from "react";
import {GatsbyImage, getImage} from "gatsby-plugin-image";
import Tags from "../presentational/tags";
import ExternalLink from "../presentational/externalLink";
import {FaExternalLinkAlt, FaGithub} from "react-icons/fa";
import "./index.scss";
import {Link} from "gatsby";


const CommonArticleCard = ({
                               currentCategory,
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
    currentCategory !== 'all' && currentCategory !== category ?<></>:
        visibility === true ?
            <Link to={`/articles/${slug}`} className="common-article-card">
                <div key={slug} className="common-article-card__wrapper">
                    <div className="common-article-card__image-container">
                        {img !== null ?
                            <img src={require(`../../../static/images/${img}`).default}
                                 alt={img} className="common-article-card__image"/> :
                            <img src={require(`../../../static/images/${category}.png`).default}
                                 alt={img} className="common-article-card__image"/>}
                    </div>
                    <div className="common-article-card__details">
                        <p className="common-article-card__category">{category}</p>
                        <h4 className="common-article-card__title">
                            {title}
                        </h4>
                        {/*<Tags tags={tags}/>*/}
                        {/*<p className="common-article-card__period">{date}</p>*/}
                        <p className="common-article-card__description">{description}</p>
                    </div>
                </div>
            </Link> : <></>

);

export default CommonArticleCard;
