import { useState, useEffect } from "react";
import api from "../api/axios";

export default function FeedAside(){
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        const fetchTopTopics = async () => {
            try {
                const response = await api.get("/topics/top");
                setTopics(response.data);
            } catch (error) {
                console.error("Error fetching top topics:", error);
            }
        };

        fetchTopTopics();
    }, []);

    return(
        <aside className="w-64 flex-shrink-0 sticky top-24 h-fit">
            <div>
                <h3 className="text-lg font-semibold text-black mb-4">Discover Topics</h3>
                <div className="space-y-2">
                    {topics.length === 0 ? (
                        <div className="text-gray-400 text-sm">No topics found.</div>
                    ) : (
                        topics.map((topic) => (
                            <a
                                key={topic.id}
                                href={"/topic/" + topic.slug}
                                className="block text-sm text-gray-700 hover:text-black transition-colors duration-200 py-1"
                            >
                                {topic.name}
                            </a>
                        ))
                    )}
                </div>
            </div>
        </aside>
    )
}