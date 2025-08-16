import { useState } from "react";
import ProfilePersonal from "../components/personal";
import Article from "../components/article";
import CollectionCard from "../components/collectionCard";

const aboutText = `Senior AI Researcher at TechCorp. Passionate about machine learning, neural networks, and the future of artificial intelligence. Writing about tech, innovation, and digital transformation. In my free time, I enjoy hiking and exploring new technologies.`;

export default function Profile() {
    const [activeTab, setActiveTab] = useState("recent");

    return (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ProfilePersonal/>

            <section className="mb-8">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8" aria-label="Tabs">
                        <button
                            className={`border-b-2 py-2 px-1 text-sm font-medium ${activeTab === "recent" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                            onClick={() => setActiveTab("recent")}
                        >
                            Recent Posts
                        </button>
                        <button
                            className={`border-b-2 py-2 px-1 text-sm font-medium ${activeTab === "collections" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                            onClick={() => setActiveTab("collections")}
                        >
                            Collections
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
                        <Article />
                        <Article />
                        <Article />
                    </>
                )}
                {activeTab === "collections" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CollectionCard type="public" />
                        <CollectionCard type="public" />
                        <CollectionCard type="public" />
                    </div>
                )}
                {activeTab === "about" && (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-2xl font-bold mb-4">About</h2>
                        <p className="text-gray-700 text-lg leading-relaxed">{aboutText}</p>
                    </div>
                )}
            </section>
        </main>
    );
}