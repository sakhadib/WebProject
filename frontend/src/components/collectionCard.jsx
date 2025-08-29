import { useNavigate } from 'react-router-dom';

export default function CollectionCard({
    name,
    description,
    coverImage,
    isPublic,
    slug,
    updatedAt,
    user
}) {
    const navigate = useNavigate();

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return '1d ago';
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)}w ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const handleCardClick = () => {
        navigate(`/collection/${slug}`);
    };

    return (
        <div 
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 group cursor-pointer"
            onClick={handleCardClick}
        >
            {/* Collection Header Image */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                    src={coverImage || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop&crop=smart"}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop&crop=smart";
                    }}
                />
                {/* Privacy Badge */}
                <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {isPublic ? "Public" : "Private"}
                    </span>
                </div>
                {/* Article Count Overlay */}
                <div className="absolute bottom-3 right-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black bg-opacity-75 text-white">
                        0 articles
                    </span>
                </div>
            </div>
            {/* Collection Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors duration-200">
                    {name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {description || "No description available"}
                </p>
                {/* Creator Info */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.username}
                                className="w-6 h-6 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-medium">
                                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        )}
                        <span className="text-sm text-gray-700">{user?.username || 'Unknown'}</span>
                    </div>
                    <time className="text-sm text-gray-500">Updated {formatDate(updatedAt)}</time>
                </div>
            </div>
        </div>
    );
}