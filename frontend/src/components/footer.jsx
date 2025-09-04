import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 mt-16 animated-gradient">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo + Description */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="text-2xl font-bold text-black">Reko</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                            A place to read, write and deepen your understanding. Join thousands of readers and writers sharing ideas that matter.
                        </p>
                        {/* Socials */}
                        <div className="flex space-x-6 mt-6">
                            <Link to="/twitter" className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883...z" />
                                </svg>
                            </Link>
                            <Link to="/facebook" className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.46 6c-.77...z" />
                                </svg>
                            </Link>
                            <Link to="/linkedin" className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554...z" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-4">Explore</h3>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-sm text-gray-600 hover:text-black transition-colors duration-200">Home</Link></li>
                             <li><Link to="/dashboard" className="text-sm text-gray-600 hover:text-black transition-colors duration-200">Dashboard</Link></li>
                             <li><Link to="/settings" className="text-sm text-gray-600 hover:text-black transition-colors duration-200">settings</Link></li>
                             <li><Link to="/write" className="text-sm text-gray-600 hover:text-black transition-colors duration-200">Write</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-4">Support</h3>
                        <ul className="space-y-3">
                            <li><Link to="/help-center" className="text-sm text-gray-600 hover:text-black transition-colors duration-200">Help Center</Link></li>
                            <li><Link to="/privacy-policy" className="text-sm text-gray-600 hover:text-black transition-colors duration-200">Privacy Policy</Link></li>
                            <li><Link to="/terms-of-services" className="text-sm text-gray-600 hover:text-black transition-colors duration-200">Terms of Service</Link></li>
                            <li><Link to="/about" className="text-sm text-gray-600 hover:text-black transition-colors duration-200">About</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-200 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-500">&copy; 2025 Reko. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link to="/status" className="text-sm text-gray-500 hover:text-black transition-colors duration-200">Status</Link>
                            <Link to="/developers" className="text-sm text-gray-500 hover:text-black transition-colors duration-200">Developers</Link>
                            <Link to="/blog" className="text-sm text-gray-500 hover:text-black transition-colors duration-200">Blog</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
