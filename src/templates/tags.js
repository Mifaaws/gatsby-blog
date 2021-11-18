import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const Tags = ({ data, location, pageContext }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allContentfulPost.edges

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title={`「${pageContext.tag}」の記事一覧`} />
        <p>
          No blog posts found.
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
      <Seo title={`「${pageContext.tag}」の記事一覧`} />
      <h3>「{pageContext.tag}」の記事一覧 ( {data.allContentfulPost.totalCount} 件)</h3>
      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.node.title || post.node.fields.slug
          const date = post.node.publishDate || post.node.createdAt;

          return (
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
                      <Link to={`/${post.node.slug}`} itemProp="url">
                        <span itemProp="headline">{title}</span>
                      </Link>
                    </h2>
                    <hr />
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
      <hr className="solid-hr" />
      <footer>
        <Bio />
      </footer>
    </Layout>
  )
}

export default Tags

export const pageQuery = graphql`
  query($tag: [String]) {
    site {
      siteMetadata {
        title
      }
    }
    allContentfulPost(sort: {fields: createdAt, order: DESC}, filter: {tags: {elemMatch: {title: { in: $tag } } } } ) {
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
      totalCount
    }
  }
`