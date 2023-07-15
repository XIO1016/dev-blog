import React from "react";

const Skills = () => {
    return <div className="skills">
        <h2>Skills</h2>
        <div className="container">
            <div className="item">
                <img src={require("../../static/icon/skills-assets/django.png").default} alt="django"/>
                <span>Django</span>
            </div>
            <div className="item">
                <img src={require("../../static/icon/skills-assets/spring.svg").default} alt="spring"/>
                <span>Spring</span>
            </div>
            <div className="item">
                <img src={require("../../static/icon/skills-assets/flutter.svg").default} alt="flutter"/>
                <span>Flutter</span>
            </div>
            <div className="item">
                <img src={require("../../static/icon/skills-assets/react.png").default} alt="react"/>
                <span>React.js</span>
            </div>
            <div className="item">
                <img src={require("../../static/icon/skills-assets/Nuxtjs.svg").default} alt="nuxt"/>
                <span>Nuxt.js</span>
            </div>
            <div className="item">
                <img src={require("../../static/icon/skills-assets/AWS.svg").default} alt="aws"/>
                <span>AWS</span>
            </div>
        </div>

    </div>
}

export default Skills;