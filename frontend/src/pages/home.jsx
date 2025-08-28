import { useState, useEffect } from "react";
import api from "../api/axios";

import Navbar from "../components/navbar";
import FeedAside from "../components/feedAside";
import Article from "../components/article";

export default function Home() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true); // loading state

    useEffect(() => {
        const fetchTopPublications = async () => {
            try {
                setLoading(true); // start loading
                const response = await api.get("/articles/published");
                setArticles(response.data.data.articles);
            } catch (error) {
                console.error("Error fetching top publications:", error);
            } finally {
                setLoading(false); // stop loading
            }
        };

        fetchTopPublications();
    }, []);

    // Simple spinner component
    const Spinner = () => (
        <div className="flex justify-center items-center py-8">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
                <FeedAside />

                <main className="flex-1 max-w-3xl">
                    <div className="mb-12">
                        <h2 className="text-3xl font-normal text-black mb-2">Latest Articles</h2>
                        <p className="text-gray-600">
                            Discover articles, thinking, and expertise from writers on any topic.
                        </p>
                    </div>

                    {loading ? (
                        <Spinner />
                    ) : articles.length === 0 ? (
                        <p className="text-gray-600">No articles found.</p>
                    ) : (
                        articles.map((article) => {
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
                                    if (excerpt && excerpt.length > 50) {
                                        return excerpt;
                                    }

                                    const parsedContent =
                                        typeof content === "string"
                                            ? JSON.parse(content)
                                            : content;
                                    const firstTextChunk = parsedContent.find(
                                        (chunk) =>
                                            chunk.style === "text" &&
                                            chunk.content &&
                                            chunk.content.length > 0
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

                            return (
                                <Article
                                    key={article.id}
                                    title={article.title}
                                    category={article.category ? article.category.name : "Uncategorized"}
                                    author={article.user.username}
                                    date={formatDate(article.created_at)}
                                    summary={getSummary(article.content, article.excerpt)}
                                    image={
                                        article.featured_image
                                            ? `http://127.0.0.1:5050/storage/${article.featured_image}`
                                            : null
                                    }
                                    // author_avatar={`https://ui-avatars.com/api/?name=${article.user.username}&background=random&size=32`}
                                    author_avatar={article.user.avatar}
                                    slug={article.slug}
                                />
                            );
                        })
                    )}
                </main>
            </div>
        </div>
    );
}
