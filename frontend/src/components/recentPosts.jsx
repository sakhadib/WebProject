import Article from "./article"

export default function RecentPosts(){

    return(
        <section>
            <div className="space-y-4">
                <Article />
                <Article />
                <Article />
            </div>
        </section>
    )
}