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
import UpdatePost from './pages/updatePost'

import BlogPost from './pages/BlogDetails'
import Footer from './components/footer'
import Navbar from './components/navbar'
import TopicShow from './pages/topicShow'
import DashBoardPage from './pages/dashboard'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/collections" element={
          <ProtectedRoute>
            <Collections />
          </ProtectedRoute>
        } />
        <Route path="/collection/:slug" element={<IndividualCollection />} />
        <Route path="/topic/:slug" element={<TopicShow />} />

        <Route path="/post/:slug" element={<PostDetails />} />
        <Route path="/article/:slug" element={<PostDetails />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashBoardPage />
          </ProtectedRoute>
        }/>

        <Route path="/write" element={
          <ProtectedRoute>
            <TestCreate />
          </ProtectedRoute>
        } />
        <Route path="/create" element={
          <ProtectedRoute>
            <TestCreate />
          </ProtectedRoute>
        } />
        <Route path="/update/:slug" element={
          <ProtectedRoute>
            <UpdatePost />
          </ProtectedRoute>
        } />
        {/* Add more routes as needed */}
      </Routes>
      <Footer />
    </>
  )
}
