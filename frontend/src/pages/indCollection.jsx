import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Article from '../components/article';

export default function IndividualCollection() {
    const { slug } = useParams();
    const [collection, setCollection] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/article/collections/show/${slug}`);
                setCollection(response.data.collection);
                setArticles(response.data.articles);
                setError(null);
            } catch (err) {
                console.error('Error fetching collection:', err);
                setError('Collection not found or failed to load');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchCollection();
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
                    <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Collection Not Found</h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </main>
        );
    }

    if (!collection) {
        return null;
    }

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Collection Header */}
            <div className="mb-12">
                {/* Cover Image */}
                {collection.cover_image && (
                    <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8">
                        <img
                            src={collection.cover_image}
                            alt={collection.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${
                                collection.is_public 
                                    ? 'bg-green-500 bg-opacity-80' 
                                    : 'bg-gray-500 bg-opacity-80'
                            }`}>
                                {collection.is_public ? 'Public Collection' : 'Private Collection'}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">{collection.name}</h1>
                            <p className="text-lg opacity-90">{articles.length} articles</p>
                        </div>
                    </div>
                )}

                {/* Collection without cover image */}
                {!collection.cover_image && (
                    <div className="mb-8">
                        <div className="flex items-center space-x-3 mb-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                collection.is_public 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {collection.is_public ? 'Public Collection' : 'Private Collection'}
                            </span>
                            <span className="text-gray-500">•</span>
                            <span className="text-sm text-gray-600">{articles.length} articles</span>
                            <span className="text-gray-500">•</span>
                            <time className="text-sm text-gray-600">
                                Created {formatDate(collection.created_at)}
                            </time>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">{collection.name}</h1>
                    </div>
                )}

                {/* Description */}
                {collection.description && (
                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                        <p className="text-lg text-gray-700 leading-relaxed">{collection.description}</p>
                    </div>
                )}

                {/* Collection Stats */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-black">Articles in this collection</h2>
                        <p className="text-gray-600 mt-1">
                            {articles.length === 0 
                                ? 'No articles in this collection yet' 
                                : `${articles.length} article${articles.length !== 1 ? 's' : ''}`
                            }
                        </p>
                    </div>
                    
                    {/* Sort/Filter options could go here */}
                    <div className="text-sm text-gray-500">
                        Updated {formatDate(collection.updated_at)}
                    </div>
                </div>
            </div>

            {/* Articles List */}
            <section>
                {articles.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
                        <p className="text-gray-500">This collection doesn't have any articles yet.</p>
                    </div>
                ) : (
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
                )}
            </section>
        </main>
    );
}
