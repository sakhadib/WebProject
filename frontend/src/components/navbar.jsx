import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ArrowDown } from "lucide-react";
export default function Navbar() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth(); 

  useEffect(() => {
    if (user) {
      try { 
        setUsername(user.username || "Profile");
      } catch {
        console.log("error while setting username in navbar component");
        setUsername("Profile");
      }
    } else {
      console.log("user is null in navbar component");
      setUsername("Profile");
    }
  }, [user]);

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout(); 
    setUsername("Profile");
    navigate("/login");
  };

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a className="text-2xl font-bold text-black" href="/">
              <ArrowDown />
            </a>
          </div>
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search stories..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black text-sm"
              />
            </div>
          </div>
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-black transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/collections"
              className="text-gray-600 hover:text-black transition-colors duration-200"
            >
              Collections
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/write"
                  className="text-white bg-black px-4 py-1 rounded-full font-semibold hover:bg-gray-900 transition-colors duration-200"
                >
                  Write
                </Link>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-black transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/settings"
                  className="text-gray-600 hover:text-black transition-colors duration-200"
                >
                  {username || "Profile"}
                </Link>
                <a
                  href="/logout"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-black transition-colors duration-200"
                >
                  Logout
                </a>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="text-gray-600 hover:text-black transition-colors duration-200"
                >
                  Sign up
                </Link>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-black transition-colors duration-200"
                >
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
