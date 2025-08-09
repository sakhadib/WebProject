import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="text-center py-24">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="text-neutral-500 mt-2">That page doesn’t exist.</p>
      <Link to="/" className="underline mt-4 inline-block">Go home</Link>
    </div>
  )
}
