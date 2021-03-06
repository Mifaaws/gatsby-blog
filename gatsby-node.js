const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const { paginate } = require("gatsby-awesome-pagination")

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Define a template for blog post
  const blogPost = path.resolve(`./src/templates/blog-post.js`);
  const tagTemplate = path.resolve(`./src/templates/tags.js`)

  // // Get all markdown blog posts sorted by date
  // const result = await graphql(
  //   `
  //     {
  //       allMarkdownRemark(
  //         sort: { fields: [frontmatter___date], order: ASC }
  //         limit: 1000
  //       ) {
  //         nodes {
  //           id
  //           fields {
  //             slug
  //           }
  //         }
  //       }
  //     }
  //   `
  // )

  // Get from Contentful
  const result = await graphql(
    `
      {
        allContentfulPost(sort: {fields: createdAt, order: DESC}) {
          edges {
            node {
              id
              title
              image {
                file {
                  url
                }
              }
              body {
                childMarkdownRemark {
                  html
                  excerpt
                }
              }
              createdAt(locale: "ja-JP", formatString: "YYYY-MM-DD")
              description {
                description
              }
              slug
              tags {
                title
                slug
              }
              publishDate(locale: "ja-JP", formatString: "YYYY-MM-DD")
            }
          }
        }
        allContentfulTags {
          edges {
            node {
              slug
              title
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  // const posts = result.data.allMarkdownRemark.nodes
  const posts = result.data.allContentfulPost.edges

  // Pagination
  paginate({
    createPage,
    items: posts,
    itemsPerPage: 10,
    component: path.resolve("src/templates/index.js"),
    pathPrefix: ({ pageNumber }) => (
      pageNumber === 0 ? "/" : "/page"
    )
  })

  // Tags
  const tags = result.data.allContentfulTags.edges
  tags.forEach(tag => {
    createPage({
      path: `/tags/${tag.node.slug}/`,
      component: tagTemplate,
      context: {
        tag: tag.node.title,
      },
    })
  }) 

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      // const previousPostId = index === 0 ? null : posts[index - 1].id
      const previousPostId = index === 0 ? null : posts[index - 1].node.id
      // const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].node.id

      createPage({
        // path: post.fields.slug,
        path: post.node.slug,
        component: blogPost,
        context: {
          // id: post.id,
          id: post.node.id,
          previousPostId,
          nextPostId,
        },
      })
    })
  }
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  // const { createNodeField } = actions

  // if (node.internal.type === `MarkdownRemark`) {
  //   const value = createFilePath({ node, getNode })

  //   createNodeField({
  //     name: `slug`,
  //     node,
  //     value,
  //   })
  // }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }
  `)
}
