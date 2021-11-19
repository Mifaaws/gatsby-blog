import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogIndex = ({ data, location, pageContext }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  // const posts = data.allMarkdownRemark.nodes
  const posts = data.allContentfulPost.edges

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="All posts" />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
        <hr />
        <footer>
          <Bio />
        </footer>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="All posts" />
      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          // const title = post.frontmatter.title || post.fields.slug
          const title = post.node.title || post.node.fields.slug
          const date = post.node.publishDate || post.node.createdAt;

          return (
            // <li key={post.fields.slug}>
            <li key={post.node.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <div>
                  <header>
                    <small>{date}</small>
                    <h2>
                      {/* <Link to={post.fields.slug} itemProp="url"> */}
                      <Link to={`/${post.node.slug}/`} itemProp="url">
                        <span itemProp="headline">{title}</span>
                      </Link>
                    </h2>
                    <hr />
                    {/* <small>{post.frontmatter.date}</small> */}
                    <div>
                      {post.node.tags.length > 0 && post.node.tags.map(tag => (
                        <p className="post-list-item-tag">
                          <Link to={`/tags/${tag.slug}/`}>
                            <span>{tag.title}</span>
                          </Link>
                        </p>
                      ))}
                    </div>
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
      <nav className="blog-list-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {pageContext.previousPagePath && (
              <Link to={pageContext.previousPagePath} rel="prev">
                ← Newer
              </Link>
            )}
          </li>
          <li>
            {pageContext.nextPagePath && (
              <Link to={pageContext.nextPagePath} rel="next">
                Older →
              </Link>
            )}
          </li>
        </ul>
      </nav>
      <hr className="solid-hr" />
      <footer>
        <Bio />
      </footer>
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
  query($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allContentfulPost(sort: {fields: createdAt, order: DESC}, skip: $skip, limit: $limit) {
      edges {
        node {
          title
          image {
            file {
              url
            }
          }
          createdAt(locale: "ja-JP", formatString: "YYYY-MM-DD")
          description {
            description
          }
          slug
          body {
            childMarkdownRemark {
              excerpt
            }
          }
          tags {
            title
            slug
          }
          publishDate(locale: "ja-JP", formatString: "YYYY-MM-DD")
        }
      }
    }
  }
`