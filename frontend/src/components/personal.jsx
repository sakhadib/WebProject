import {useEffect, useState} from "react";
import api from "../api/axios";

export default function ProfilePersonal({ user, articlesCount = 0, collectionsCount = 0 }) {
    
    const [personal, setPersonal] = useState(null);

    useEffect(() => {
        const fetchPersonalInfo = async () => {
            try {
                const response = await api.get(`/profile/adibsakhawat`);
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
                <div className="mb-6">
                    <img
                        src={personal?.avatar || `https://ui-avatars.com/api/?name=${personal?.username || 'User'}&background=random&size=128`}
                        alt={personal?.username || 'User'}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                        onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${personal?.username || 'User'}&background=random&size=128`;
                        }}
                    />
                    
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
                        <div className="text-2xl font-bold text-black">0</div>
                        <div className="text-sm text-gray-600">Followers</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-black">{articlesCount}</div>
                        <div className="text-sm text-gray-600">Posts</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-black">{collectionsCount}</div>
                        <div className="text-sm text-gray-600">Collections</div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-200 font-medium">
                        Follow
                    </button>
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 hover:border-black hover:text-black transition-colors duration-200 font-medium">
                        Message
                    </button>
                </div>
            </div>
        </section>
    );
}