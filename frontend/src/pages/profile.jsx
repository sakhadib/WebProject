import ProfilePersonal from "../components/personal"
import RecentPosts from "../components/recentPosts"

export default function Profile(){
    return(
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ProfilePersonal />

            <section class="mb-8">
                <div class="border-b border-gray-200">
                    <nav class="flex space-x-8" aria-label="Tabs">
                        <button class="border-b-2 border-black text-black py-2 px-1 text-sm font-medium">
                            Recent Posts
                        </button>
                        <button class="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-2 px-1 text-sm font-medium">
                            Collections
                        </button>
                        <button class="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-2 px-1 text-sm font-medium">
                            About
                        </button>
                    </nav>
                </div>
            </section>

            <section class="space-y-8">
                <RecentPosts />
            </section>
        </main>
    )
}