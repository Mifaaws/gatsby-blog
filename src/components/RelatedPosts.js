import React from "react"
import { graphql, useStaticQuery, Link } from "gatsby"

const RelatedPosts = (props) => {
  const randomSelect = (arr,  num) => {
    let newArray = [];

    while (newArray.length < num && arr.length > 0) {
      const rand = Math.floor(Math.random() * arr.length);
      newArray.push(arr[rand]);
      arr.splice(rand, 1);
    }
    return newArray
  }

  const data = useStaticQuery(graphql`
    query {
      allContentfulPost {
        nodes {
          body {
            childMarkdownRemark {
              excerpt
            }
          }
          id
          image {
            file {
              url
            }
          }
          publishDate(locale: "ja-JP", formatString: "YYYY-MM-DD")
          createdAt(locale: "ja-JP", formatString: "YYYY-MM-DD")
          tags {
            slug
            title
          }
          title
          slug
        }
      }
    }
  `)

  const basePosts = data.allContentfulPost.nodes.filter((node) => {
    // return node.id !== props.id && node.tags.map(tag => tag.title)[0] === props.tags[0].title
    return node.id !== props.id
  });
  const relatedPosts = randomSelect(basePosts, props.pNum);

  console.log(basePosts)  

  if (!relatedPosts.length) {
    return null;
  }

  return (
    <div className="related-posts">
      <h4>関連記事</h4>
      <ol>
        {relatedPosts.map(node => {
          return (
            <li key={node.slug}>
              <article
                className="related-post-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <div>
                  <header>
                    <small>{node.publishDate || node.createdAt}</small>
                    <h4>
                      <Link to={`/${node.slug}`} itemProp="url">
                        <span itemProp="headline">{node.title}</span>
                      </Link>
                    </h4>
                  </header>
                  <section>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: node.description ? node.description.description : node.body.childMarkdownRemark.excerpt,
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
    </div>
  )
}

export default RelatedPosts
