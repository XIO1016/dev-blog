module.exports = {
    siteMetadata: {
        title: `Xio`,
        description: `A Growing Software Developer`,
        author: `@xio1016`,
        siteUrl: `https://xio1016.site/`,
        img: "/icon/dolphin.png"
    },
    plugins: [
        `gatsby-plugin-advanced-sitemap`,
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [
                    {
                        resolve: 'gatsby-remark-prismjs',
                        options: {
                            classPrefix: 'language-',
                            inlineCodeMarker: null,
                            aliases: {},
                        },
                    }, {
                        resolve: `gatsby-remark-autolink-headers`,
                        options: {
                            offsetY: `100`,
                            icon: `<svg aria-hidden="true" height="20" version="1.1" viewBox="0 0 16 16" width="20"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`,
                            className: `custom-class`,
                            maintainCase: false,
                            removeAccents: true,
                            isIconAfterHeader: true,
                            elements: [`h1`, `h2`, `h3`],
                        },
                    },
                ],
            },
        },
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `static`,
                path: `${__dirname}/static`,
            },
        },
        `gatsby-transformer-json`,
        `gatsby-plugin-image`,
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `Xio`,
                short_name: `Xio`,
                start_url: `/`,
                background_color: `#0D1219`,
                theme_color: `#0D1219`,
                display: `minimal-ui`,
                icon: `static/icon/logo.svg`, // This path is relative to the root of the site.
            },
        },
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.dev/offline
        `gatsby-plugin-offline`,
        `gatsby-plugin-sass`,
        `gatsby-plugin-force-trailing-slashes`,
        `gatsby-plugin-preload-fonts`,

        // {
        //   resolve: `gatsby-plugin-google-gtag`,
        //   options: {
        //     trackingIds: [process.env.GATSBY_GA_TRACKING_ID],
        //     gtagConfig: {
        //       anonymize_ip: true,
        //     },
        //     pluginConfig: {
        //       head: true,
        //     },
        //   },
        // },
        {
            resolve: `gatsby-plugin-nprogress`,
            options: {
                color: `#FF9000`,
                showSpinner: false,
                minimum: 0.2,
            },
        },
    ],
};
