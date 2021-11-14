import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogPostTemplate = ({ data, location }) => {
  // const post = data.markdownRemark
  const post = data.contentfulPost
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const { previous, next } = data

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        // title={post.frontmatter.title}
        // description={post.frontmatter.description || post.excerpt}
        title={post.title}
        // description={post.description.description}
        description={post.description ? post.description.description : post.body.childMarkdownRemark.excerpt}
      />
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          {/* <h1 itemProp="headline">{post.frontmatter.title}</h1> */}
          {/* <p>{post.frontmatter.date}</p> */}
          <h1 itemProp="headline">{post.title}</h1>
          <p>{post.createdAt}</p>
          <div>
            {post.tags.length > 0 && post.tags.map(tag => (
              <p className="post-link-tag"><span>{tag.title}</span></p>
            ))}
          </div>
        </header>
        {post.image &&
          <div className="post-link-image">
            <img src={post.image.file.url} alt="post-cover"></img>
          </div>
        }
        <section
          // dangerouslySetInnerHTML={{ __html: post.html }}
          dangerouslySetInnerHTML={{ __html: post.body.childMarkdownRemark.html }}
          itemProp="articleBody"
        />
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
      <nav className="blog-post-nav">
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
            {previous && (
              // <Link to={previous.fields.slug} rel="prev">
                // ← {previous.frontmatter.title}
              <Link to={`/${previous.slug}`} rel="prev">
                ← {previous.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              // <Link to={next.fields.slug} rel="next">
              //   {next.frontmatter.title} →
              <Link to={`/${next.slug}`} rel="next">
                {next.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

// export const pageQuery = graphql`
//   query BlogPostBySlug(
//     $id: String!
//     $previousPostId: String
//     $nextPostId: String
//   ) {
//     site {
//       siteMetadata {
//         title
//       }
//     }
//     markdownRemark(id: { eq: $id }) {
//       id
//       excerpt(pruneLength: 160)
//       html
//       frontmatter {
//         title
//         date(formatString: "YYYY-MM-DD")
//         description
//       }
//     }
//     previous: markdownRemark(id: { eq: $previousPostId }) {
//       fields {
//         slug
//       }
//       frontmatter {
//         title
//       }
//     }
//     next: markdownRemark(id: { eq: $nextPostId }) {
//       fields {
//         slug
//       }
//       frontmatter {
//         title
//       }
//     }
//   }
// `

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    contentfulPost(id: { eq: $id }) {
      id
      body {
        body
        childMarkdownRemark {
          html
          excerpt
        }
      }
      title
      createdAt(locale: "ja-JP", formatString: "YYYY-MM-DD")
      description {
        description
      }
      image {
        file {
          url
        }
      }
      tags {
        title
        slug
      }
    }
    previous: contentfulPost(id: { eq: $previousPostId }) {
      slug
      title
    }
    next: contentfulPost(id: { eq: $nextPostId }) {
      slug
      title
    }
  }
`

