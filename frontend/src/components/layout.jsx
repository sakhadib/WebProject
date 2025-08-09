import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Outlet />
      </main>
      <footer className="mx-auto max-w-3xl px-4 pb-10 text-sm text-neutral-500">
        © {new Date().getFullYear()} My Blog
      </footer>
    </div>
  )
}
