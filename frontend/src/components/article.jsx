import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import api from '../api/axios';

export default function Article({ title, category, author, date, summary, image, author_avatar, slug }) {
    const navigate = useNavigate();
    const [commentCount, setCommentCount] = useState(0);

    useEffect(() => {
        const fetchTopPublications = async () => {
            try {
                const response = await api.get(`/articles/${slug}/getcommentcount`);
                setCommentCount(response.data.comment_count);
            } catch (error) {
                console.error("Error fetching comment count:", error);
            }
        };

        fetchTopPublications();
    }, [slug]);

    const handleArticleClick = () => {
        if (slug) {
            navigate(`/article/${slug}`);
        }
    };

    return (
        <article className="group mb-12">
            <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3">
                    <img
                        src={author_avatar}
                        alt="Author"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex items-center space-x-2 text-sm">
                        <span className="font-medium text-gray-900">{author}</span>
                        <span className="text-gray-500">•</span>
                        <span className="inline-block px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">{category}</span>
                        <span className="text-gray-500">•</span>
                        <time className="text-gray-500">{date}</time>
                    </div>
                </div>

                <div className="flex items-start space-x-6">
                    <div className="flex-1">
                        <h3
                            className="text-2xl font-bold text-black mb-3 group-hover:text-gray-700 transition-colors duration-200 cursor-pointer leading-tight"
                            onClick={handleArticleClick}
                        >
                            {title}
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed mb-4 line-clamp-3">
                            {summary}
                        </p>
                    </div>

                    {/* Render image only if it's not null */}
                    {image && (
                        <div
                            className="w-32 h-20 bg-gray-200 rounded flex-shrink-0 cursor-pointer"
                            onClick={handleArticleClick}
                        >
                            <img
                                src={image}
                                alt="Article"
                                className="w-full h-full object-cover rounded"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1 hover:text-black transition-colors duration-200 cursor-pointer">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>{commentCount}</span>
                        </div>
                    </div>
                    <a
                        href={`/article/${slug}`}
                        className="text-sm text-gray-600 hover:text-black transition-colors duration-200 font-medium"
                        onClick={(e) => {
                            e.preventDefault();
                            handleArticleClick();
                        }}
                    >
                        Read story →
                    </a>
                </div>
            </div>

            <hr className="my-8" />
        </article>
    );
}
