/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";

import Navigation from "../navigation";
import {Link} from "gatsby";
import Wave from "react-wavify";

const Layout = ({children, isHomePage}) => (
    <>
        {(
            <header>
                <Link to="/" className="rocket" data-cy="rocket">
                </Link>
                <Navigation/>
            </header>
        )}
        <main className={`container ${!isHomePage ? "no-wave" : "wave"}`}>
            {/*<div className={`planet ${!isHomePage ? "small" : ""}`}></div>*/}
            {/*<div className="stars">*/}
            {/*  {Array(10)*/}
            {/*    .fill()*/}
            {/*    .map((_e, i) => (*/}
            {/*      <span className="star" key={`star-${i}`}></span>*/}
            {/*    ))}*/}
            {/*</div>*/}
            <div className="page">{children}</div>
        </main>
        {isHomePage&&(<Wave mask="url(#mask)" fill="#fffff" >
            <defs>
                <linearGradient id="gradient" gradientTransform="rotate(90)">
                    <stop offset="0" stopColor="white" />
                    <stop offset="0.6" stopColor="black" />
                </linearGradient>
                <mask id="mask">
                    <rect x="0" y="0" width="100vw" height="240" fill="url(#gradient)"  />
                </mask>
            </defs>
        </Wave>)}
        <footer>
      <span className="copyright">
        © {new Date().getFullYear()}, Xio1016
      </span>
            {/*<Theme/>*/}
        </footer>
    </>
);

Layout.propTypes = {
    children: PropTypes.node.isRequired,
    isHomePage: PropTypes.bool,
};

Layout.defaultProps = {
    isHomePage: false,
};

export default Layout;
