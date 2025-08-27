
import { useState, useEffect } from "react";
import Article from "../components/article";
import CollectionCard from "../components/collectionCard";

import api from "../api/axios";


export default function Collections() {
    const [activeTab, setActiveTab] = useState("all");
    const [me, setMe] = useState(null);


    useEffect(() => {
        const fetchTopPublications = async () => {
            try {
                const response = await api.post("/auth/me");
                setMe(response.data.user);
            } catch (error) {
                console.error("Error fetching top publications:", error);
            }
        };

        fetchTopPublications();
    }, []);

    // Example data for demonstration; in a real app, fetch from API or props
    const collections = [
        { id: 1, type: "public" },
        { id: 2, type: "public" },
        { id: 3, type: "private" },
        { id: 4, type: "public" },
        { id: 5, type: "private" },
        { id: 6, type: "public" },
        { id: 7, type: "public" },
    ];

    let filteredCollections = collections;
    if (activeTab === "public") {
        filteredCollections = collections.filter((c) => c.type === "public");
    } else if (activeTab === "private") {
        filteredCollections = collections.filter((c) => c.type === "private");
    }

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                {me?.avatar ? (
                    <img
                    src={me.avatar}
                    alt={me.username}
                    className="w-12 h-12 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium">
                    {me?.first_name?.[0]}{me?.last_name?.[0]}
                    </div>
                )}
                <div>
                    <h1 className="text-3xl font-bold text-black">{me?.first_name} {me?.last_name}'s Collections</h1>
                    <p className="text-gray-600">Curated lists of articles and stories</p>
                </div>
                </div>
                <button className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-200 font-medium flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>New Collection</span>
                </button>
            </div>
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8" aria-label="Tabs">
                <button
                    className={`border-b-2 py-3 px-1 text-sm font-medium ${activeTab === "all" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                    onClick={() => setActiveTab("all")}
                >
                    All Collections (15)
                </button>
                <button
                    className={`border-b-2 py-3 px-1 text-sm font-medium ${activeTab === "public" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                    onClick={() => setActiveTab("public")}
                >
                    Public (12)
                </button>
                <button
                    className={`border-b-2 py-3 px-1 text-sm font-medium ${activeTab === "private" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                    onClick={() => setActiveTab("private")}
                >
                    Private (3)
                </button>
                </nav>
            </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollections.map((col) => (
                <CollectionCard key={col.id} type={col.type} />
            ))}
            </section>
        </main>
        );
}