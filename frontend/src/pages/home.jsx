import PostCard from '../components/postcard'
import { posts } from '../data/posts'

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Latest posts</h1>
      <div className="grid gap-4">
        {posts.map(p => <PostCard key={p.slug} post={p} />)}
      </div>
    </div>
  )
}
