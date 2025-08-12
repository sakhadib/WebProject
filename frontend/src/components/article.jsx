export default function Article() {
    return (
        <article className="group mb-12">
            <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3">
                    <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                        alt="Author"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex items-center space-x-2 text-sm">
                        <span className="font-medium text-gray-900">Alex Chen</span>
                        <span className="text-gray-500">•</span>
                        <span className="inline-block px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">Technology</span>
                        <span className="text-gray-500">•</span>
                        <time className="text-gray-500">Aug 8, 2025</time>
                    </div>
                </div>
                <div className="flex items-start space-x-6">
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-black mb-3 group-hover:text-gray-700 transition-colors duration-200 cursor-pointer leading-tight">
                            The Future of Artificial Intelligence: What We Can Expect in the Next Decade
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed mb-4 line-clamp-3">
                            As we stand at the precipice of a new era in technology, artificial intelligence continues to evolve at an unprecedented pace. From healthcare to transportation, AI is reshaping every aspect of our daily lives...
                        </p>
                    </div>
                    <div className="w-32 h-20 bg-gray-200 rounded flex-shrink-0">
                        <img
                            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop&crop=smart"
                            alt="AI Technology"
                            className="w-full h-full object-cover rounded"
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1 hover:text-black transition-colors duration-200 cursor-pointer">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>247</span>
                        </div>
                        <div className="flex items-center space-x-1 hover:text-black transition-colors duration-200 cursor-pointer">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>18</span>
                        </div>
                    </div>
                    <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors duration-200 font-medium">
                        Read story →
                    </a>
                </div>
            </div>

            <hr className="my-8" />
        </article>
    );
}