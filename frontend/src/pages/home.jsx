import Navbar from "../components/Navbar";
import FeedAside from "../components/feedAside";

export default function Home(){
    return (
        <div>
            <Navbar />
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
                <FeedAside />
            </div>
            
        </div>
    );
}