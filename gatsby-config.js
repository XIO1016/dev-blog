module.exports = {
  siteMetadata: {
    title: `Xio`,
    description: `A Growing Software Developer`,
    author: `@xio1016`,
    siteUrl: `https://xio1016.site/`,
  },
  plugins: [
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
