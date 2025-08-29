import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Article from '../components/article';

export default function TopicShow() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [topic, setTopic] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopic = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/topics/${slug}`);
                setTopic({
                    id: response.data.id,
                    name: response.data.name,
                    slug: response.data.slug,
                    created_at: response.data.created_at,
                    updated_at: response.data.updated_at
                });
                setArticles(response.data.articles);
                setError(null);
            } catch (err) {
                console.error('Error fetching topic:', err);
                setError('Topic not found or failed to load');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchTopic();
        }
    }, [slug]);

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Extract summary from content or excerpt
    const getSummary = (content, excerpt) => {
        try {
            if (excerpt && excerpt.length > 50) {
                return excerpt;
            }
            
            const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
            const firstTextChunk = parsedContent.find(chunk => 
                chunk.style === 'text' && chunk.content && chunk.content.length > 0
            );
            
            if (firstTextChunk) {
                return firstTextChunk.content.length > 150 
                    ? firstTextChunk.content.substring(0, 150) + '...'
                    : firstTextChunk.content;
            }
            
            return 'No summary available';
        } catch {
            return excerpt || 'No summary available';
        }
    };

    if (loading) {
        return (
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-lg mb-8"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Topic Not Found</h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </main>
        );
    }

    if (!topic) {
        return null;
    }

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Topic Header */}
            <div className="mb-12">
                {/* Topic Hero Section */}
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 md:p-12 mb-8">
                    <div className="relative z-10">
                        
                        <h1 className="text-4xl md:text-6xl font-bold text-black mb-4 capitalize">
                            {topic.name}
                        </h1>
                        
                        <div className="flex items-center space-x-4 text-gray-600">
                            <span className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>{articles.length} article{articles.length !== 1 ? 's' : ''}</span>
                            </span>
                            <span className="text-gray-500">•</span>
                            <span>Created {formatDate(topic.created_at)}</span>
                        </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-black bg-opacity-5 rounded-full"></div>
                    <div className="absolute bottom-4 right-12 w-12 h-12 bg-black bg-opacity-10 rounded-full"></div>
                </div>

                {/* Topic Stats */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-black">Articles about {topic.name}</h2>
                        <p className="text-gray-600 mt-1">
                            {articles.length === 0 
                                ? 'No articles found for this topic' 
                                : `Discover ${articles.length} article${articles.length !== 1 ? 's' : ''} related to ${topic.name}`
                            }
                        </p>
                    </div>
                    
                    {/* Follow Topic Button */}
                    {/* <button className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-200 font-medium rounded-lg flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Follow Topic</span>
                    </button> */}
                </div>
            </div>

            {/* Articles Section */}
            <section>
                {articles.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles yet</h3>
                        <p className="text-gray-500 mb-6">There are no articles about "{topic.name}" yet.</p>
                        <button 
                            onClick={() => navigate('/write')}
                            className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-200 font-medium rounded-lg"
                        >
                            Write the first article
                        </button>
                    </div>
                ) : (
                    <div>
                        {/* Articles Header */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Latest articles
                                </h3>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <span>Sort by:</span>
                                    <button className="text-black font-medium hover:text-gray-700 transition-colors">
                                        Recent
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Articles List */}
                        <div>
                            {articles.map((article) => (
                                <Article 
                                    key={article.id}
                                    title={article.title}
                                    category={article.category ? article.category.name : 'Uncategorized'}
                                    author={article.user ? article.user.username : 'Unknown Author'}
                                    date={formatDate(article.created_at)}
                                    summary={getSummary(article.content, article.excerpt)}
                                    image={article.featured_image ? `http://127.0.0.1:5050/storage/${article.featured_image}` : 'https://via.placeholder.com/128x80?text=No+Image'}
                                    author_avatar={article.user?.avatar || `https://ui-avatars.com/api/?name=${article.user?.username || 'User'}&background=random&size=32`}
                                    slug={article.slug}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}