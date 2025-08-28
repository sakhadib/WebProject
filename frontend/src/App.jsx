import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup'
import Profile from './pages/profile'
import Collections from './pages/collections'
import IndividualCollection from './pages/indCollection'

import PostDetails from './pages/postDetail'
import CreateBlog from './pages/CreateBlog'

import TestCreate from './pages/testCreate'

import BlogPost from './pages/BlogDetails'
import Footer from './components/footer'
import Navbar from './components/navbar'
import TopicShow from './pages/topicShow'
import DashBoardPage from './pages/dashboard'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collection/:slug" element={<IndividualCollection />} />
        <Route path="/topic/:slug" element={<TopicShow />} />

        <Route path="/post/:slug" element={<PostDetails />} />
        <Route path="/article/:slug" element={<PostDetails />} />

        <Route path="/dashboard" element={<DashBoardPage />}/>

        <Route path="/write" element={<TestCreate />} />
        <Route path="/create" element={<TestCreate />} />
        {/* Add more routes as needed */}
      </Routes>
      <Footer />
    </>
  )
}
