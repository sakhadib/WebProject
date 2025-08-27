import { useState , useEffect} from "react";
import api from "../api/axios";

import Navbar from "../components/navbar";
import FeedAside from "../components/feedAside";
import Article from "../components/article";

export default function Home(){

    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchTopPublications = async () => {
            try {
                const response = await api.get("/articles/published");
                setArticles(response.data.data.articles);
            } catch (error) {
                console.error("Error fetching top publications:", error);
            }
        };

        fetchTopPublications();
    }, []);


    return (
        <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
                <FeedAside />

                <main className="flex-1 max-w-3xl">

                    <div className="mb-12">
                        <h2 className="text-3xl font-normal text-black mb-2">Latest Articles</h2>
                        <p className="text-gray-600">Discover articles, thinking, and expertise from writers on any topic.</p>
                    </div>

                    {articles.length === 0 ? (
                        <p className="text-gray-600">No articles found.</p>
                    ) : (
                        articles.map((article) => {
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

                            return (
                                <Article 
                                    key={article.id} 
                                    title={article.title}
                                    category={article.category ? article.category.name : 'Uncategorized'}
                                    author={article.user.username}
                                    date={formatDate(article.created_at)}
                                    summary={getSummary(article.content, article.excerpt)}
                                    image={article.featured_image ? `http://127.0.0.1:5050/storage/${article.featured_image}` : 'https://via.placeholder.com/128x80?text=No+Image'}
                                    author_avatar={`https://ui-avatars.com/api/?name=${article.user.username}&background=random&size=32`}
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