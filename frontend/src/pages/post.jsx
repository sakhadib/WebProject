import { useParams, Link } from 'react-router-dom'
import { posts } from '../data/posts'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

export default function Post() {
  const { slug } = useParams()
  const post = posts.find(p => p.slug === slug)

  if (!post) {
    return (
      <div>
        <p className="text-sm text-neutral-500">Post not found.</p>
        <Link to="/" className="underline">Back to home</Link>
      </div>
    )
  }

  const html = DOMPurify.sanitize(marked.parse(post.content))

  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1 className="!mb-2">{post.title}</h1>
      <p className="!mt-0 text-sm text-neutral-500">
        {new Date(post.date).toLocaleDateString()}
        {post.tags?.length ? <> • {post.tags.join(', ')}</> : null}
      </p>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  )
}
