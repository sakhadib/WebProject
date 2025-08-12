export default function ProfilePersonal() {
    return (
        <section className="mb-16">
            <div className="flex flex-col items-center text-center">
                <div className="mb-6">
                    <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
                        alt="Alex Chen"
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                </div>
                <div className="mb-4">
                    <h1 className="text-4xl font-bold text-black mb-2">Alex Chen</h1>
                    <p className="text-xl text-gray-600">@alexchen_tech</p>
                </div>
                <div className="mb-6 max-w-2xl">
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Senior AI Researcher at TechCorp. Passionate about machine learning, neural networks, and the future of artificial intelligence. Writing about tech, innovation, and digital transformation.
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