import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Comment from '../components/singleComment';
import { useAuth } from '../context/AuthContext';

export default function PostDetails() {
    const { slug } = useParams();
    const { user } = useAuth();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState('');
    const [isAddingToCollection, setIsAddingToCollection] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    
    // Comment states
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [commentsLoading, setCommentsLoading] = useState(false);

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

    // Fetch comments when article is loaded
    useEffect(() => {
        const fetchComments = async () => {
            if (!article) return;
            
            try {
                setCommentsLoading(true);
                const response = await api.get(`/articles/${article.id}/getcomments`);
                setComments(response.data.comments);
            } catch (error) {
                console.error('Error fetching comments:', error);
            } finally {
                setCommentsLoading(false);
            }
        };

        fetchComments();
    }, [article]);

    // Handle submitting a new comment
    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || !article) return;

        setIsSubmittingComment(true);
        try {
            const response = await api.post(`/articles/${article.id}/comments`, {
                content: commentText,
                article_id: article.id
            });
            
            // Add the new comment to the list
            setComments(prev => [...prev, response.data.comment]);
            setCommentText('');
            showToast('Comment posted successfully!', 'success');
        } catch (error) {
            console.error('Error posting comment:', error);
            if (error.response?.status === 401) {
                showToast('Please log in to post a comment.', 'error');
            } else {
                showToast('Failed to post comment. Please try again.', 'error');
            }
        } finally {
            setIsSubmittingComment(false);
        }
    };

    // Format time ago
    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInDays < 7) return `${diffInDays}d ago`;
        
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    // Show toast notification
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
        }, 4000);
    };

    // Fetch user's collections when modal opens
    const fetchCollections = async () => {
        try {
            const response = await api.get('/article/collections');
            setCollections(response.data.data);
        } catch (error) {
            console.error('Error fetching collections:', error);
        }
    };

    // Handle opening collection modal
    const handleAddToCollection = () => {
        setShowCollectionModal(true);
        fetchCollections();
    };

    // Handle adding article to selected collection
    const handleSubmitToCollection = async () => {
        if (!selectedCollection || !article) return;

        setIsAddingToCollection(true);
        try {
            await api.post('/article/collections/add-article', {
                collection_id: selectedCollection,
                article_id: article.id
            });
            
            showToast('Article added to collection successfully!', 'success');
            setShowCollectionModal(false);
            setSelectedCollection('');
        } catch (error) {
            console.error('Error adding article to collection:', error);
            if (error.response?.status === 403) {
                showToast('You can only add articles to your own collections.', 'error');
            } else {
                showToast('Failed to add article to collection. Please try again.', 'error');
            }
        } finally {
            setIsAddingToCollection(false);
        }
    };

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
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img 
                            src={`http://127.0.0.1:5050/storage/${article.user.avatar}`} 
                            alt={`${article.user.username}'s avatar`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback to letter avatar if image fails to load
                                e.target.outerHTML = `
                                    <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                                        <span class="text-lg font-semibold text-gray-600">
                                            ${article.user.username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                `;
                            }}
                        />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{article.user.username}</div>
                        <div className="text-sm text-gray-600">{article.user.email}</div>
                    </div>
                    <div className="flex-1"></div>
                    <div className="flex items-center space-x-3">
                        <button 
                            onClick={handleAddToCollection}
                            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
                        >
                            Add to Collection
                        </button>
                    </div>
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

            {/* Comments Section */}
            <section className="mt-16 border-t border-gray-200 pt-12">
                <h2 className="text-2xl font-bold text-black mb-8">
                    Comments ({comments.length})
                </h2>

                {/* Comment Form */}
                <form onSubmit={handleSubmitComment} className="mb-12">
                    <div className="flex space-x-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            {user?.avatar ? (
                                <img
                                    src={`http://127.0.0.1:5050/storage/${user.avatar}`}
                                    alt={`${user.username || 'User'}'s avatar`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Fallback to letter avatar if image fails to load
                                        e.target.outerHTML = `
                                            <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                <span class="text-sm font-semibold text-gray-600">
                                                    ${(user?.username || 'U').charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        `;
                                    }}
                                />
                            ) : (
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-semibold text-gray-600">
                                        {(user?.username || 'U').charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment..."
                                rows="3"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                                maxLength="1000"
                            />
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-sm text-gray-500">
                                    {commentText.length}/1000 characters
                                </span>
                                <button
                                    type="submit"
                                    disabled={!commentText.trim() || isSubmittingComment}
                                    className="px-6 py-2 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm rounded-lg"
                                >
                                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Comments List */}
                {commentsLoading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse flex space-x-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
                        <p className="text-gray-500">Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {comments.map((comment) => (
                            <Comment
                                key={comment.id}
                                comment={{
                                    id: comment.id,
                                    author: comment.user?.username || 'Anonymous',
                                    avatar: comment.user?.avatar || `https://ui-avatars.com/api/?name=${comment.user?.username || 'User'}&background=random&size=40`,
                                    content: comment.content,
                                    timeAgo: formatTimeAgo(comment.created_at),
                                    likes: 0 // API doesn't provide likes yet
                                }}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Add to Collection Modal */}
            {showCollectionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-black">Add to Collection</h2>
                                <button
                                    onClick={() => setShowCollectionModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {collections.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">You don't have any collections yet.</p>
                                    <p className="text-sm text-gray-400">Create a collection first to organize your articles.</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Select a collection to add "{article?.title}" to:
                                    </p>
                                    
                                    <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                                        {collections.map((collection) => (
                                            <label
                                                key={collection.id}
                                                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                                    selectedCollection === collection.id.toString()
                                                        ? 'border-black bg-gray-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="collection"
                                                    value={collection.id}
                                                    checked={selectedCollection === collection.id.toString()}
                                                    onChange={(e) => setSelectedCollection(e.target.value)}
                                                    className="mr-3"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <h3 className="font-medium text-gray-900">{collection.name}</h3>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                                            collection.is_public 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {collection.is_public ? 'Public' : 'Private'}
                                                        </span>
                                                    </div>
                                                    {collection.description && (
                                                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                                                            {collection.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                                        <button
                                            onClick={() => setShowCollectionModal(false)}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSubmitToCollection}
                                            disabled={!selectedCollection || isAddingToCollection}
                                            className="px-6 py-2 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                                        >
                                            {isAddingToCollection ? 'Adding...' : 'Add to Collection'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed top-4 right-4 z-50 transform transition-all duration-300 ease-out">
                    <div className={`flex items-center p-4 rounded-lg shadow-lg min-w-80 ${
                        toast.type === 'success' 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-red-50 border border-red-200'
                    }`}>
                        <div className="flex-shrink-0">
                            {toast.type === 'success' ? (
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>
                        <div className="ml-3">
                            <p className={`text-sm font-medium ${
                                toast.type === 'success' ? 'text-green-800' : 'text-red-800'
                            }`}>
                                {toast.message}
                            </p>
                        </div>
                        <div className="ml-auto pl-3">
                            <div className="-mx-1.5 -my-1.5">
                                <button
                                    onClick={() => setToast({ show: false, message: '', type: 'success' })}
                                    className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                        toast.type === 'success'
                                            ? 'text-green-500 hover:bg-green-100 focus:ring-green-600'
                                            : 'text-red-500 hover:bg-red-100 focus:ring-red-600'
                                    }`}
                                >
                                    <span className="sr-only">Dismiss</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}