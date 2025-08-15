import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup'
import Profile from './pages/profile'
import Collections from './pages/collections'
import CreateBlog from './pages/CreateBlog'
import BlogPost from './pages/BlogDetails'
import Footer from './components/footer'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/blog/new" element={<CreateBlog />} /> 
        <Route path="/blog/:id" element={<BlogPost />}/>
        {/* Add more routes as needed */}
      </Routes>
      <Footer />
    </>
  )
}
