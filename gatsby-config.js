require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `Euquid tech blog`,
    author: {
      name: `ゆーたむ / Web Engineer`,
      summary: `東京の会社員. 本業はサーバサイド (AWS / Node) . 最近Reactやってる人.`,
    },
    description: `Webエンジニアの技術ブログ。日々学んだことの備忘録です。Node.js, Typescript, React, Gatsby, AWS, Linuxなど。`,
    siteUrl: `https://blog.euquid.com`,
    // social: {
    //   twitter: `euquid`,
    // },
  },
  plugins: [
    `gatsby-plugin-image`,
    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     path: `${__dirname}/content/blog`,
    //     name: `blog`,
    //   },
    // },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          'gatsby-remark-prismjs-title',  // Codeblock's file name
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    // {
    //   resolve: `gatsby-plugin-google-analytics`,
    //   options: {
    //     trackingId: `ADD YOUR TRACKING ID HERE`,
    //   },
    // },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [ process.env.GATSBY_GA_TRACKING_ID ],
      }
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            // serialize: ({ query: { site, allMarkdownRemark } }) => {
            //   return allMarkdownRemark.nodes.map(node => {
            //     return Object.assign({}, node.frontmatter, {
            //       description: node.excerpt,
            //       date: node.frontmatter.date,
            //       url: site.siteMetadata.siteUrl + node.fields.slug,
            //       guid: site.siteMetadata.siteUrl + node.fields.slug,
            //       custom_elements: [{ "content:encoded": node.html }],
            //     })
            //   })
            // },
            // query: `
            //   {
            //     allMarkdownRemark(
            //       sort: { order: DESC, fields: [frontmatter___date] },
            //     ) {
            //       nodes {
            //         excerpt
            //         html
            //         fields {
            //           slug
            //         }
            //         frontmatter {
            //           title
            //           date
            //         }
            //       }
            //     }
            //   }
            // `,
            serialize: ({ query: { site, allContentfulPost } }) => {
              return allContentfulPost.nodes.map(node => {
                return Object.assign({}, node, {
                  description: node.description ? node.description.description : node.body.childMarkdownRemark.excerpt,
                  date: node.publishDate ? node.publishDate : node.createdAt,
                  url: site.siteMetadata.siteUrl + node.slug,
                  guid: site.siteMetadata.siteUrl + node.slug,
                  custom_elements: [{ "content:encoded": node.body.childMarkdownRemark.html }],
                })
              })
            },
            query: `
              {
                allContentfulPost(sort: {order: DESC, fields: createdAt}) {
                  nodes {
                    body {
                      childMarkdownRemark {
                        excerpt
                        html
                      }
                    }
                    slug
                    description {
                      description
                    }
                    createdAt
                    publishDate
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Gatsby Starter Blog RSS Feed",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Euquid tech blog`,
        short_name: `Euquid`,
        start_url: `/`,
        background_color: `#ffffff`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/splotch.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-react-helmet`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: process.env.GATSBY_CONTENTFUL_SPACE_ID,
        accessToken: process.env.GATSBY_CONTENTFUL_API_KEY
      }
    },
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://blog.euquid.com`,
        stripQueryString: true,
      },
    },
  ],
}
