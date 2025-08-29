
import { useState, useEffect } from "react";
import Article from "../components/article";
import CollectionCard from "../components/collectionCard";

import api from "../api/axios";


export default function Collections() {
    const [activeTab, setActiveTab] = useState("all");
    const [me, setMe] = useState(null);
    const [collections, setCollections] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        cover_image: '',
        is_public: 1,
        slug: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);


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


    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const response = await api.get("/article/collections");
                setCollections(response.data.data);
            } catch (error) {
                console.error("Error fetching collections:", error);
            }
        };

        fetchCollections();
    }, []);

    // Filter collections based on privacy setting
    let filteredCollections = collections;
    if (activeTab === "public") {
        filteredCollections = collections.filter((c) => c.is_public === 1);
    } else if (activeTab === "private") {
        filteredCollections = collections.filter((c) => c.is_public === 0);
    }

    // Count collections for tab labels
    const totalCount = collections.length;
    const publicCount = collections.filter(c => c.is_public === 1).length;
    const privateCount = collections.filter(c => c.is_public === 0).length;

    // Generate slug from name
    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? (checked ? 1 : 0) : value;
        
        setFormData(prev => {
            const updated = { ...prev, [name]: newValue };
            
            // Auto-generate slug when name changes
            if (name === 'name') {
                updated.slug = generateSlug(value);
            }
            
            return updated;
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await api.post('/article/collections/add', formData);
            
            // Add new collection to the list without reloading
            const newCollection = {
                ...response.data.data,
                user: me // Add user info to the new collection
            };
            setCollections(prev => [newCollection, ...prev]);
            
            // Reset form and close modal
            setFormData({
                name: '',
                description: '',
                cover_image: '',
                is_public: 1,
                slug: ''
            });
            setShowModal(false);
            
        } catch (error) {
            console.error('Error creating collection:', error);
            alert('Failed to create collection. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    {me?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                )}
                <div>
                    <h1 className="text-3xl font-bold text-black">{me?.username || 'User'}'s Collections</h1>
                    <p className="text-gray-600">Curated lists of articles and stories</p>
                </div>
                </div>
                <button 
                    className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-200 font-medium flex items-center space-x-2"
                    onClick={() => setShowModal(true)}
                >
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
                    All Collections ({totalCount})
                </button>
                <button
                    className={`border-b-2 py-3 px-1 text-sm font-medium ${activeTab === "public" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                    onClick={() => setActiveTab("public")}
                >
                    Public ({publicCount})
                </button>
                <button
                    className={`border-b-2 py-3 px-1 text-sm font-medium ${activeTab === "private" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                    onClick={() => setActiveTab("private")}
                >
                    Private ({privateCount})
                </button>
                </nav>
            </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollections.length === 0 ? (
                <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">No collections found.</p>
                </div>
            ) : (
                filteredCollections.map((collection) => (
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
                        user={collection.user}
                    />
                ))
            )}
            </section>

            {/* Create Collection Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-black">Create New Collection</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Collection Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Collection Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                        placeholder="e.g., Snake and Ladder"
                                    />
                                </div>

                                {/* Auto-generated Slug */}
                                <div>
                                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                                        Slug (Auto-generated)
                                    </label>
                                    <input
                                        type="text"
                                        id="slug"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50"
                                        placeholder="auto-generated-from-name"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">URL-friendly version of your collection name</p>
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                        placeholder="Describe what this collection is about..."
                                    />
                                </div>

                                {/* Cover Image */}
                                <div>
                                    <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700 mb-2">
                                        Cover Image URL
                                    </label>
                                    <input
                                        type="url"
                                        id="cover_image"
                                        name="cover_image"
                                        value={formData.cover_image}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    
                                    {/* Image Preview */}
                                    {formData.cover_image && (
                                        <div className="mt-3">
                                            <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                            <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={formData.cover_image}
                                                    alt="Cover preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                    onLoad={(e) => {
                                                        e.target.style.display = 'block';
                                                        e.target.nextSibling.style.display = 'none';
                                                    }}
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500" style={{display: 'none'}}>
                                                    <div className="text-center">
                                                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <p className="text-sm">Invalid image URL</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Privacy Setting */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Privacy Setting
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="is_public"
                                                value={1}
                                                checked={formData.is_public === 1}
                                                onChange={handleInputChange}
                                                className="mr-2"
                                            />
                                            <span className="text-sm">Public - Anyone can view this collection</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="is_public"
                                                value={0}
                                                checked={formData.is_public === 0}
                                                onChange={handleInputChange}
                                                className="mr-2"
                                            />
                                            <span className="text-sm">Private - Only you can view this collection</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !formData.name.trim()}
                                        className="px-6 py-2 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                                    >
                                        {isSubmitting ? 'Creating...' : 'Create Collection'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </main>
        );
}