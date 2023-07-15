import React from "react";
import { Link} from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import {APP_ROUTES, EMAIL} from "../helpers/constants";
import Emoji from "../components/presentational/emoji";
import {TypeAnimation} from "react-type-animation";
import Skills from "../components/skills";

const AboutPage = () => {
  //   const data = useStaticQuery(graphql`
  //   query {
  //     profileImage: file(relativePath: { eq: "images/profile_picture.png" }) {
  //       childImageSharp {
  //         gatsbyImageData(layout: FIXED, width: 200, height: 200, placeholder: BLURRED)
  //       }
  //     }
  //   }
  // `);
    return (
        <Layout>
            <SEO title="About"/>
            <div className="about-page">
                <div className="typer">
                <TypeAnimation
                    sequence={[
                        "Welcome! 👋🏻",
                        1000,
                        "I am XIO🌊",
                        1000,
                        // "My name is Songgyeong Oh",
                        "Software Developer 💻",
                        1000,
                        "Like to Learn ❤️",
                        1000,
                        "A Growing Programmer 🚀",
                        1000,
                        "This is a space for storing and sharing knowledge ☺️",
                        1500,
                    ]}
                    wrapper="span"
                    speed={50}
                    style={{fontSize: '2em', display: 'inline-block', fontWeight: 'bold'}}
                    repeat={Infinity}
                />
                </div>
                {/*<div className="profile-image-container">*/}
                {/*  <GatsbyImage*/}
                {/*    image={getImage(data.profileImage)}*/}
                {/*    alt="Xio's Profile Picture"*/}
                {/*    className="profile-image"*/}
                {/*  />*/}
                {/*</div>*/}
                <div className="content">
                    <h2>XIO 🌊</h2>
                    <p>
                        I majored in Computer Science and Engineering. I'm currently interested in the
                        Backend and Cloud Engineering.
                        I'm always thinking about designing good software.
                        I like to learn new things and grow.
                        I want to be a developer who is not satisfied with today and always develops myself for a better
                        tomorrow.
                    </p>
                    <Skills />
                </div>
                <br/>
                <ul>
                    <li>
                        <Emoji label="Email" emoji={" 📧 "}/>
                        {EMAIL.email}
                    </li>
                    <li>
                        <Emoji label="Writing Hand" emoji={" ✍🏻 "}/>
                        <Link to={APP_ROUTES.blog} data-cy={APP_ROUTES.blog}>
                            Come to see my blog posts!
                        </Link>
                    </li>
                    <li>
                        <Emoji label="Laptop" emoji={" 💻 "}/>
                        <Link to={APP_ROUTES.projects} data-cy={APP_ROUTES.projects}>
                            Come to see my works!
                        </Link>
                    </li>
                </ul>
            </div>
        </Layout>
    );
};

export default AboutPage;
