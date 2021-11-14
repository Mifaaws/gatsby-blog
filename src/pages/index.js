import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  // const posts = data.allMarkdownRemark.nodes
  const posts = data.allContentfulPost.edges

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="All posts" />
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="All posts" />
      <Bio />
      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          // const title = post.frontmatter.title || post.fields.slug
          const title = post.node.title || post.node.fields.slug

          return (
            // <li key={post.fields.slug}>
            <li key={post.node.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <div>
                  {post.node.image &&
                    <Link to={post.node.slug} itemProp="url">
                      <img src={post.node.image.file.url} className="post-list-item-image" alt="post-cover"></img>
                    </Link>
                  }
                </div>
                <div>
                  <header>
                    <h2>
                      {/* <Link to={post.fields.slug} itemProp="url"> */}
                      <Link to={post.node.slug} itemProp="url">
                        <span itemProp="headline">{title}</span>
                      </Link>
                    </h2>
                    {/* <small>{post.frontmatter.date}</small> */}
                    <small>{post.node.updatedAt}</small>
                  </header>
                  <section>
                    <p
                      dangerouslySetInnerHTML={{
                        // __html: post.frontmatter.description || post.excerpt,
                        __html: post.node.description ? post.node.description.description : post.node.body.childMarkdownRemark.excerpt,
                      }}
                      itemProp="description"
                    />
                  </section>
                </div>
              </article>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default BlogIndex

// export const pageQuery = graphql`
//   query {
//     site {
//       siteMetadata {
//         title
//       }
//     }
//     allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
//       nodes {
//         excerpt
//         fields {
//           slug
//         }
//         frontmatter {
//           date(formatString: "YYYY-MM-DD")
//           title
//           description
//         }
//       }
//     }
//   }
// `

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allContentfulPost {
      edges {
        node {
          title
          image {
            file {
              url
            }
          }
          updatedAt(locale: "ja-JP", formatString: "YYYY-MM-DD")
          description {
            description
          }
          slug
          body {
            childMarkdownRemark {
              excerpt
            }
          }
        }
      }
    }
  }
`