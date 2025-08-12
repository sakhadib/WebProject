import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'

import Footer from './components/footer'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* Add more routes as needed */}
      </Routes>
      <Footer />
    </>
  )
}
