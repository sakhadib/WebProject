import Navbar from "../components/navbar";
import FeedAside from "../components/feedAside";
import Article from "../components/article";

export default function Home(){
    return (
        <div>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
                <FeedAside />

                <main class="flex-1 max-w-3xl">

                    <div class="mb-12">
                        <h2 class="text-3xl font-normal text-black mb-2">Latest Articles</h2>
                        <p class="text-gray-600">Discover articles, thinking, and expertise from writers on any topic.</p>
                    </div>

                    <Article />
                    <Article />
                    <Article />
                    <Article />

                </main>


            </div>
            
        </div>
    );
}