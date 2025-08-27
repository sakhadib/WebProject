import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import ProfilePersonal from "../components/personal";
import Article from "../components/article";
import CollectionCard from "../components/collectionCard";

export default function Profile() {
    const { username } = useParams();
    const [activeTab, setActiveTab] = useState("recent");
    const [user, setUser] = useState(null);
    const [articles, setArticles] = useState([]);
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                // Fetch user profile by username
                const userResponse = await api.get(`/user/${username}`);
                setUser(userResponse.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchUserData();
        }
    }, [username]);

    useEffect(() => {
        const fetchUserArticles = async () => {
            try {
                const response = await api.get(`/articles/@${user.username}`);
                setArticles(response.data.data.articles);
            } catch (error) {
                console.error("Error fetching user articles:", error);
            }
        };

        if (user && user.username) {
            fetchUserArticles();
        }
    }, [user]);

    useEffect(() => {
        const fetchUserCollections = async () => {
            try {
                const response = await api.get(`/user/${username}/collections`);
                setCollections(response.data.data);
            } catch (error) {
                console.error("Error fetching user collections:", error);
            }
        };

        if (username) {
            fetchUserCollections();
        }
    }, [username]);

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
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-lg mb-8"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ProfilePersonal 
                user={user} 
                articlesCount={articles.length} 
                collectionsCount={collections.length} 
            />

            <section className="mb-8">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8" aria-label="Tabs">
                        <button
                            className={`border-b-2 py-2 px-1 text-sm font-medium ${activeTab === "recent" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                            onClick={() => setActiveTab("recent")}
                        >
                            Recent Posts ({articles.length})
                        </button>
                        <button
                            className={`border-b-2 py-2 px-1 text-sm font-medium ${activeTab === "collections" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                            onClick={() => setActiveTab("collections")}
                        >
                            Collections ({collections.length})
                        </button>
                        <button
                            className={`border-b-2 py-2 px-1 text-sm font-medium ${activeTab === "about" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                            onClick={() => setActiveTab("about")}
                        >
                            About
                        </button>
                    </nav>
                </div>
            </section>

            <section className="space-y-8">
                {activeTab === "recent" && (
                    <>
                        {articles.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
                                <p className="text-gray-500">Start writing to share your thoughts with the world.</p>
                            </div>
                        ) : (
                            articles.map((article) => (
                                <Article 
                                    key={article.id}
                                    title={article.title}
                                    category={article.category ? article.category.name : 'Uncategorized'}
                                    author={user?.username || 'Unknown Author'}
                                    date={formatDate(article.created_at)}
                                    summary={getSummary(article.content, article.excerpt)}
                                    image={article.featured_image ? `http://127.0.0.1:5050/storage/${article.featured_image}` : 'https://via.placeholder.com/128x80?text=No+Image'}
                                    author_avatar={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=random&size=32`}
                                    slug={article.slug}
                                />
                            ))
                        )}
                    </>
                )}
                {activeTab === "collections" && (
                    <>
                        {collections.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No collections yet</h3>
                                <p className="text-gray-500">Create collections to organize your favorite articles.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {collections.map((collection) => (
                                    <CollectionCard
                                        key={collection.id}
                                        id={collection.id}
                                        name={collection.name}
                                        description={collection.description}
                                        coverImage={collection.cover_image}
                                        isPublic={collection.is_public}
                                        slug={collection.slug}
                                        createdAt={collection.created_at}
                                        updatedAt={collection.updated_at}
                                        user={user}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
                {activeTab === "about" && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-2xl font-bold text-black mb-4">About {user?.first_name} {user?.last_name}</h2>
                        {user?.bio ? (
                            <p className="text-gray-700 text-lg leading-relaxed">{user.bio}</p>
                        ) : (
                            <p className="text-gray-500 italic">No bio available.</p>
                        )}
                        
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center space-x-3 text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>@{user?.username}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>{user?.email}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2z" />
                                </svg>
                                <span>Joined {formatDate(user?.created_at)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}