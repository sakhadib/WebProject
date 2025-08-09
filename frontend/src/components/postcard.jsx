import { Link } from 'react-router-dom'

export default function PostCard({ post }) {
  return (
    <article className="group rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 p-5 hover:shadow-lg transition">
      <h2 className="text-xl font-semibold">
        <Link to={`/post/${post.slug}`} className="group-hover:underline">
          {post.title}
        </Link>
      </h2>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">{post.excerpt}</p>
      <div className="mt-3 text-xs text-neutral-500">
        {new Date(post.date).toLocaleDateString()}
        {post.tags?.length ? <> • {post.tags.join(', ')}</> : null}
      </div>
    </article>
  )
}
