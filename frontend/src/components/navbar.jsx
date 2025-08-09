import { Link, NavLink } from 'react-router-dom'
import { PenSquare } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-950/60 border-b border-neutral-200/60 dark:border-neutral-800/60">
      <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <PenSquare className="h-5 w-5" />
          <span>My Blog</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <NavLink to="/" className={({isActive}) => isActive ? "underline" : "hover:opacity-80"}>Home</NavLink>
          {/* Add About/Contact later */}
        </nav>
      </div>
    </header>
  )
}
