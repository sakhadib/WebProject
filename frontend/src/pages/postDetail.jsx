import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function PostDetails() {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/articles/${slug}`);
                setArticle(response.data.data.article);
                setError(null);
            } catch (err) {
                console.error('Error fetching article:', err);
                setError('Article not found or failed to load');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchArticle();
        }
    }, [slug]);

    // Styles for content chunks (same as editor)
    const styles = {
        "h1": "text-4xl font-bold mb-8 text-black leading-tight",
        "h2": "text-3xl font-bold mb-6 text-black leading-tight",
        "h3": "text-2xl font-bold mb-4 text-black leading-tight",
        "h4": "text-xl font-bold mb-3 text-black leading-tight",
        "text": "text-lg text-gray-700 leading-relaxed mb-6",
        "quote": "border-l-4 border-gray-400 pl-6 italic text-xl text-gray-800 mb-8 bg-gray-50 py-4",
        "code": "bg-gray-900 text-gray-100 p-4 rounded-lg font-mono mb-6 overflow-x-auto",
        "bullet": "mb-6",
        "enumerate": "mb-6",
        "caption": "text-sm text-gray-500 italic mb-4 text-center"
    };

    const renderContent = (chunks) => {
        try {
            const parsedChunks = typeof chunks === 'string' ? JSON.parse(chunks) : chunks;
            
            return parsedChunks.map((chunk, index) => {
                const isListType = ['bullet', 'enumerate'].includes(chunk.style);
                
                if (isListType && chunk.points && chunk.points.length > 0) {
                    return (
                        <div key={index} className={styles[chunk.style]}>
                            {chunk.style === 'bullet' ? (
                                <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 ml-4">
                                    {chunk.points.map((point, pointIndex) => (
                                        <li key={pointIndex}>{point}</li>
                                    ))}
                                </ul>
                            ) : (
                                <ol className="list-decimal list-inside space-y-2 text-lg text-gray-700 ml-4">
                                    {chunk.points.map((point, pointIndex) => (
                                        <li key={pointIndex}>{point}</li>
                                    ))}
                                </ol>
                            )}
                        </div>
                    );
                }

                // Handle other content types
                if (chunk.style === 'code') {
                    return (
                        <pre key={index} className={styles[chunk.style]}>
                            <code>{chunk.content}</code>
                        </pre>
                    );
                }

                // Handle headings and regular text
                const Tag = chunk.style.startsWith('h') ? chunk.style : 'p';
                return (
                    <Tag key={index} className={styles[chunk.style]}>
                        {chunk.content}
                    </Tag>
                );
            });
        } catch (error) {
            console.error('Error parsing content:', error);
            return <p className="text-red-500">Error rendering content</p>;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const calculateReadingTime = (content) => {
        try {
            const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
            const wordCount = parsedContent.reduce((total, chunk) => {
                let words = 0;
                if (chunk.content) {
                    words += chunk.content.split(' ').length;
                }
                if (chunk.points && chunk.points.length > 0) {
                    words += chunk.points.join(' ').split(' ').length;
                }
                return total + words;
            }, 0);
            
            return Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
        } catch {
            return 5; // Default reading time
        }
    };

    if (loading) {
        return (
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="h-12 bg-gray-200 rounded w-3/4 mb-8"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
                    <div className="h-64 bg-gray-200 rounded mb-8"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </main>
        );
    }

    if (!article) {
        return null;
    }

    const readingTime = calculateReadingTime(article.content);

    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="mb-12">
                <div className="flex items-center space-x-2 mb-6">
                    <span className="inline-block px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
                        {article.category.name}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{readingTime} min read</span>
                    <span className="text-gray-500">•</span>
                    <time className="text-sm text-gray-500">
                        {formatDate(article.created_at)}
                    </time>
                </div>

                <h1 className="text-5xl font-bold text-black mb-8 leading-tight">
                    {article.title}
                </h1>

                <div className="flex items-center space-x-4 mb-8">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-gray-600">
                            {article.user.username.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{article.user.username}</div>
                        <div className="text-sm text-gray-600">{article.user.email}</div>
                    </div>
                    <div className="flex-1"></div>
                    <button className="px-4 py-2 border border-black text-black hover:bg-black hover:text-white transition-colors duration-200 text-sm font-medium">
                        Follow
                    </button>
                </div>

                {article.featured_image && (
                    <div className="mb-12">
                        <img 
                            src={`http://127.0.0.1:5050/storage/${article.featured_image}`}
                            alt={article.title}
                            className="w-full h-96 object-cover rounded-lg"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>
                )}
            </header>

            <article className="prose prose-lg max-w-none">
                {renderContent(article.content)}
            </article>
        </main>
    );
}