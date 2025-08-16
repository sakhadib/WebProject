import {useEffect, useState} from "react";
import api from "../api/axios";

export default function ProfilePersonal() {
    
    const [personal, setPersonal] = useState();

    useEffect(() => {
        const fetchPersonalInfo = async () => {
            const response = await api.get(`/profile/adibsakhawat`);
            setPersonal(response.data);
        };

        fetchPersonalInfo();
    }, []);

    return (
        <section className="mb-16">
            <div className="flex flex-col items-center text-center">
                <div className="mb-6">
                    <img
                        src={personal.avatar}
                        alt={personal.username}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    
                </div>
                <div className="mb-4">
                    <h1 className="text-4xl font-bold text-black mb-2">{personal.first_name} {personal.last_name}</h1>
                    <p className="text-xl text-gray-600">@{personal.username}</p>
                </div>
                <div className="mb-6 max-w-2xl">
                    <p className="text-lg text-gray-700 leading-relaxed">
                        {personal.bio}
                    </p>
                </div>
                <div className="flex items-center space-x-8 mb-8">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-black">1,247</div>
                        <div className="text-sm text-gray-600">Followers</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-black">89</div>
                        <div className="text-sm text-gray-600">Posts</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-black">15</div>
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