import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup'

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
        {/* Add more routes as needed */}
      </Routes>
      <Footer />
    </>
  )
}
