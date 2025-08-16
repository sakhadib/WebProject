import { useState, useEffect } from "react";
import api from "../api/axios";

export default function FeedAside(){
    const [topPublications, setTopPublications] = useState([]);

    useEffect(() => {
        const fetchTopPublications = async () => {
            try {
                const response = await api.get("/publications/top");
                setTopPublications(response.data);
            } catch (error) {
                console.error("Error fetching top publications:", error);
            }
        };

        fetchTopPublications();
    }, []);

    return(
        <aside className="w-64 flex-shrink-0 sticky top-24 h-fit">
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-black mb-4">Top Publications</h3>
                <div className="space-y-3">
                    {topPublications.length === 0 ? (
                        <div className="text-gray-400 text-sm">No publications found.</div>
                    ) : (
                        topPublications.map((pub) => (
                            <a
                                key={pub.id}
                                href={"/publication/" + pub.id}
                                className="flex items-center space-x-3 text-gray-700 hover:text-black transition-colors duration-200"
                            >
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-bold">
                                        {pub.title
                                            ? pub.title.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2)
                                            : "PU"}
                                    </span>
                                </div>
                                <span className="text-sm truncate max-w-[120px]">{pub.title}</span>
                            </a>
                        ))
                    )}
                </div>
            </div>

            <div>
                <h3 class="text-lg font-semibold text-black mb-4">Discover Topics</h3>
                <div class="space-y-2">
                    <a href="#" class="block text-sm text-gray-700 hover:text-black transition-colors duration-200 py-1">Technology</a>
                    <a href="#" class="block text-sm text-gray-700 hover:text-black transition-colors duration-200 py-1">Design</a>
                    <a href="#" class="block text-sm text-gray-700 hover:text-black transition-colors duration-200 py-1">Business</a>
                    <a href="#" class="block text-sm text-gray-700 hover:text-black transition-colors duration-200 py-1">Personal Growth</a>
                    <a href="#" class="block text-sm text-gray-700 hover:text-black transition-colors duration-200 py-1">Science</a>
                    <a href="#" class="block text-sm text-gray-700 hover:text-black transition-colors duration-200 py-1">Health</a>
                    <a href="#" class="block text-sm text-gray-700 hover:text-black transition-colors duration-200 py-1">Programming</a>
                    <a href="#" class="block text-sm text-gray-700 hover:text-black transition-colors duration-200 py-1">Startups</a>
                    <a href="#" class="block text-sm text-gray-700 hover:text-black transition-colors duration-200 py-1">Politics</a>
                    <a href="#" class="block text-sm text-gray-700 hover:text-black transition-colors duration-200 py-1">Culture</a>
                    <a href="#" class="block text-sm text-gray-700 hover:text-black transition-colors duration-200 py-1">Productivity</a>
                    <a href="#" class="block text-sm text-gray-700 hover:text-black transition-colors duration-200 py-1">Leadership</a>
                    <a href="#" class="block text-sm text-gray-700 hover:text-black transition-colors duration-200 py-1">Marketing</a>
                    <a href="#" class="block text-sm text-gray-700 hover:text-black transition-colors duration-200 py-1">Artificial Intelligence</a>
                    <a href="#" class="block text-sm text-gray-700 hover:text-black transition-colors duration-200 py-1">Photography</a>
                </div>
            </div>
        </aside>
    )
}