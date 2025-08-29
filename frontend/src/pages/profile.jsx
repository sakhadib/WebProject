import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ProfilePersonal from "../components/personal";
import Article from "../components/article";
import CollectionCard from "../components/collectionCard";

export default function Profile() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("recent");
    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [articles, setArticles] = useState([]);
    const [collections, setCollections] = useState([]);
    const [drafts, setDrafts] = useState([]);
    const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

    // separate loading states
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingArticles, setLoadingArticles] = useState(true);
    const [loadingCollections, setLoadingCollections] = useState(true);
    const [loadingDrafts, setLoadingDrafts] = useState(false);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await api.post('/auth/me');
                    setCurrentUser(response.data);
                }
            } catch (error) {
                console.error("Error fetching current user:", error);
                // User not authenticated, that's okay
            }
        };

        fetchCurrentUser();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoadingUser(true);
                const userResponse = await api.get(`/user/${username}`);
                setUser(userResponse.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoadingUser(false);
            }
        };

        if (username) fetchUserData();
    }, [username]);

    useEffect(() => {
        const fetchUserArticles = async () => {
            try {
                setLoadingArticles(true);
                // Always request only published articles for the Recent Posts tab
                const response = await api.get(`/articles/@${user.username}?status=published`);
                setArticles(response.data.data.articles);
            } catch (error) {
                console.error("Error fetching user articles:", error);
            } finally {
                setLoadingArticles(false);
            }
        };

        if (user?.username) fetchUserArticles();
    }, [user]);

    useEffect(() => {
        const fetchUserCollections = async () => {
            try {
                setLoadingCollections(true);
                const response = await api.get(`/user/${username}/collections`);
                setCollections(response.data.data);
            } catch (error) {
                console.error("Error fetching user collections:", error);
            } finally {
                setLoadingCollections(false);
            }
        };

        if (username) fetchUserCollections();
    }, [username]);

    useEffect(() => {
        const fetchDrafts = async () => {
            try {
                setLoadingDrafts(true);
                const response = await api.get('/articles/my/drafts');
                setDrafts(response.data.data.drafts);
            } catch (error) {
                console.error("Error fetching drafts:", error);
            } finally {
                setLoadingDrafts(false);
            }
        };

        // Only fetch drafts if current user is viewing their own profile
        if (currentUser && user && currentUser.username === user.username) {
            fetchDrafts();
        }
    }, [currentUser, user]);

    const handlePublishDraft = async (articleId) => {
        try {
            await api.patch(`/articles/${articleId}/publish`);
            // Remove the published article from drafts
            setDrafts(prev => prev.filter(draft => draft.id !== articleId));
            // Optionally, you could also refresh the articles list
            alert("Article published successfully!");
        } catch (error) {
            console.error("Error publishing article:", error);
            alert("Failed to publish article. Please try again.");
        }
    };

    const handleEditDraft = (slug) => {
        navigate(`/update/${slug}`);
    };

    const handleAvatarUpdate = async (file) => {
        if (!file) return;

        try {
            setIsUpdatingAvatar(true);
            
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await api.post('/user/update-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Update the user state with new avatar
            setUser(prev => ({
                ...prev,
                avatar: response.data.data.avatar_path
            }));

            // Also update current user if it's the same user
            if (currentUser && currentUser.username === user.username) {
                setCurrentUser(prev => ({
                    ...prev,
                    avatar: response.data.data.avatar_path
                }));
            }

            alert('Profile picture updated successfully!');
        } catch (error) {
            console.error('Error updating avatar:', error);
            if (error.response?.data?.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat();
                alert('Error updating avatar:\n' + errorMessages.join('\n'));
            } else {
                alert('Failed to update profile picture. Please try again.');
            }
        } finally {
            setIsUpdatingAvatar(false);
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file.');
                return;
            }
            // Validate file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('File size must be less than 2MB.');
                return;
            }
            handleAvatarUpdate(file);
        }
    };

    // Check if the current user is viewing their own profile
    const isOwnProfile = currentUser && user && currentUser.username === user.username;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getSummary = (content, excerpt) => {
        try {
            if (excerpt && excerpt.length > 50) return excerpt;

            const parsedContent = typeof content === "string" ? JSON.parse(content) : content;
            const firstTextChunk = parsedContent.find(
                (chunk) => chunk.style === "text" && chunk.content?.length > 0
            );

            if (firstTextChunk) {
                return firstTextChunk.content.length > 150
                    ? firstTextChunk.content.substring(0, 150) + "..."
                    : firstTextChunk.content;
            }
            return "No summary available";
        } catch {
            return excerpt || "No summary available";
        }
    };

    // Skeleton Loader
    const SkeletonLoader = () => (
        <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
            </div>
        </div>
    );

    // 🔹 If still fetching user, show big skeleton
    if (loadingUser) {
        return (
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <SkeletonLoader />
            </main>
        );
    }

    return (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ProfilePersonal
                user={user}
                articlesCount={articles.length}
                collectionsCount={collections.length}
                isOwnProfile={isOwnProfile}
                onAvatarUpdate={handleFileSelect}
                isUpdatingAvatar={isUpdatingAvatar}
            />

            <section className="mb-8">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8" aria-label="Tabs">
                        <button
                            className={`border-b-2 py-2 px-1 text-sm font-medium ${
                                activeTab === "recent"
                                    ? "border-black text-black"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                            onClick={() => setActiveTab("recent")}
                        >
                            Recent Posts ({articles.length})
                        </button>
                        <button
                            className={`border-b-2 py-2 px-1 text-sm font-medium ${
                                activeTab === "collections"
                                    ? "border-black text-black"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                            onClick={() => setActiveTab("collections")}
                        >
                            Collections ({collections.length})
                        </button>
                        {isOwnProfile && (
                            <button
                                className={`border-b-2 py-2 px-1 text-sm font-medium ${
                                    activeTab === "drafts"
                                        ? "border-black text-black"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                                onClick={() => setActiveTab("drafts")}
                            >
                                Drafts ({drafts.length})
                            </button>
                        )}
                        <button
                            className={`border-b-2 py-2 px-1 text-sm font-medium ${
                                activeTab === "about"
                                    ? "border-black text-black"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
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
                        {loadingArticles ? (
                            <SkeletonLoader />
                        ) : articles.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-8 h-8 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No articles yet
                                </h3>
                                <p className="text-gray-500">
                                    Start writing to share your thoughts with the world.
                                </p>
                            </div>
                        ) : (
                            articles.map((article) => (
                                <Article
                                    key={article.id}
                                    title={article.title}
                                    category={article.category ? article.category.name : "Uncategorized"}
                                    author={user?.username || "Unknown Author"}
                                    date={formatDate(article.created_at)}
                                    summary={getSummary(article.content, article.excerpt)}
                                    image={
                                        article.featured_image
                                            ? `http://127.0.0.1:5050/storage/${article.featured_image}`
                                            : null
                                    }
                                    author_avatar={
                                        user?.avatar ||
                                        `https://ui-avatars.com/api/?name=${user?.username || "User"}&background=random&size=32`
                                    }
                                    slug={article.slug}
                                />
                            ))
                        )}
                    </>
                )}

                {activeTab === "collections" && (
                    <>
                        {loadingCollections ? (
                            <SkeletonLoader />
                        ) : collections.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-8 h-8 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No collections yet
                                </h3>
                                <p className="text-gray-500">
                                    Create collections to organize your favorite articles.
                                </p>
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

                {activeTab === "drafts" && isOwnProfile && (
                    <>
                        {loadingDrafts ? (
                            <SkeletonLoader />
                        ) : drafts.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-8 h-8 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No drafts yet
                                </h3>
                                <p className="text-gray-500">
                                    Your draft articles will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Draft Articles</h3>
                                    <p className="text-sm text-gray-500 mt-1">Manage your unpublished articles</p>
                                </div>
                                
                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Title
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Category
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Created
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Updated
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {drafts.map((draft) => (
                                                <tr key={draft.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                                            {draft.title}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {draft.category ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                {draft.category.name}
                                                            </span>
                                                        ) : (
                                                            <span className="text-sm text-gray-500">Uncategorized</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(draft.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(draft.updated_at)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <button
                                                                onClick={() => handleEditDraft(draft.slug)}
                                                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
                                                            >
                                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handlePublishDraft(draft.id)}
                                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
                                                            >
                                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                                </svg>
                                                                Publish
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {activeTab === "about" && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-2xl font-bold text-black mb-4">
                            About {user?.first_name} {user?.last_name}
                        </h2>
                        {user?.bio ? (
                            <p className="text-gray-700 text-lg leading-relaxed">{user.bio}</p>
                        ) : (
                            <p className="text-gray-500 italic">No bio available.</p>
                        )}

                        <div className="mt-6 space-y-3">
                            <div className="flex items-center space-x-3 text-gray-600">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                <span>@{user?.username}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-600">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z"
                                    />
                                </svg>
                                <span>{user?.email}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-600">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2z"
                                    />
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
