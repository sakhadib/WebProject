import {useEffect, useState} from "react";
import api from "../api/axios";

export default function ProfilePersonal({ 
    user, 
    articlesCount = 0, 
    collectionsCount = 0, 
    isOwnProfile = false, 
    onAvatarUpdate = null,
    isUpdatingAvatar = false 
}) {
    
    const [personal, setPersonal] = useState(null);

    useEffect(() => {
        const fetchPersonalInfo = async () => {
            try {
                const response = await api.get(`/auth/me`);
                setPersonal(response.data);
                
            } catch (error) {
                console.error("Error fetching personal info:", error);
            }
        };

        // If user prop is provided, use it instead of fetching
        if (user) {
            setPersonal(user);
        } else {
            fetchPersonalInfo();
        }
    }, [user]);

    // Show loading state if personal data is not available
    if (!personal) {
        return (
            <section className="mb-16">
                <div className="flex flex-col items-center text-center animate-pulse">
                    <div className="mb-6">
                        <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-lg"></div>
                    </div>
                    <div className="mb-4">
                        <div className="h-10 bg-gray-200 rounded w-64 mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-32"></div>
                    </div>
                    <div className="mb-6 max-w-2xl">
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="mb-16">
            <div className="flex flex-col items-center text-center">
                <div className="mb-6 relative">
                    <div className="relative">
                        <img
                            src={personal?.avatar ? `http://127.0.0.1:5050/storage/${personal.avatar}` : `https://ui-avatars.com/api/?name=${personal?.username || 'User'}&background=random&size=128`}
                            alt={personal?.username || 'User'}
                            className={`w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg transition-opacity ${isUpdatingAvatar ? 'opacity-50' : 'opacity-100'}`}
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${personal?.username || 'User'}&background=random&size=128`;
                            }}
                        />
                        
                        {/* Loading overlay */}
                        {isUpdatingAvatar && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                    
                    {/* Avatar Update Button - Only show for own profile */}
                    {isOwnProfile && onAvatarUpdate && (
                        <div className="absolute bottom-0 right-0">
                            <label 
                                htmlFor="avatar-upload"
                                className={`bg-black text-white p-2 rounded-full cursor-pointer hover:bg-gray-800 transition-colors shadow-lg border-2 border-white ${isUpdatingAvatar ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="Update profile picture"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={onAvatarUpdate}
                                className="hidden"
                                disabled={isUpdatingAvatar}
                            />
                        </div>
                    )}
                </div>
                <div className="mb-4">
                    <h1 className="text-4xl font-bold text-black mb-2">
                        {personal?.first_name && personal?.last_name 
                            ? `${personal.first_name} ${personal.last_name}` 
                            : personal?.username || 'User'
                        }
                    </h1>
                    <p className="text-xl text-gray-600">@{personal?.username || 'username'}</p>
                </div>
                <div className="mb-6 max-w-2xl">
                    <p className="text-lg text-gray-700 leading-relaxed">
                        {personal?.bio || 'No bio available.'}
                    </p>
                </div>
                <div className="flex items-center space-x-8 mb-8">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-black">{articlesCount}</div>
                        <div className="text-sm text-gray-600">Posts</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-black">{collectionsCount}</div>
                        <div className="text-sm text-gray-600">Collections</div>
                    </div>
                </div>
                
            </div>
        </section>
    );
}