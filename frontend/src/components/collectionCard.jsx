export default function CollectionCard({type}) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 group cursor-pointer">
            {/* Collection Header Image */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                    src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop&crop=smart"
                    alt="AI and Machine Learning"
                    className="w-full h-full object-cover"
                />
                {/* Privacy Badge */}
                <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {type === "public" ? "Public" : "Private"}
                    </span>
                </div>
                {/* Article Count Overlay */}
                <div className="absolute bottom-3 right-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black bg-opacity-75 text-white">
                        12 articles
                    </span>
                </div>
            </div>
            {/* Collection Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors duration-200">
                    AI and Machine Learning
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    A curated collection of the latest developments in artificial intelligence, machine learning algorithms, and their practical applications across industries.
                </p>
                {/* Creator Info */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                            alt="Alex Chen"
                            className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-700">Alex Chen</span>
                    </div>
                    <time className="text-sm text-gray-500">Updated 2d ago</time>
                </div>
            </div>
        </div>
    );
}