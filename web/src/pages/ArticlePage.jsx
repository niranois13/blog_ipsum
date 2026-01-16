import { useParams } from "react-router-dom";
import { useGetArticleById } from "../hooks/article/useGetArticleById";
import CommentList from "../components/features/Comment/CommentList";

export default function ArticlePage() {
    const { id } = useParams();
    const { data, isLoading, isError, error } = useGetArticleById(id);

    if (isLoading) return <p>Loading article...</p>;
    if (isError) return <p>Error: {error?.message || "Could not fetch article."}</p>;
    if (!data.article) return <p>Article not found</p>;
    if (!data.commentTree) return;

    const { title, content, coverUrl, coverAlt, updatedAt } = data.article;

    return (
        <main className="max-w-6xl mx-auto p-4 space-y-6">
            {coverUrl && (
                <img
                    src={coverUrl}
                    alt={coverAlt || "Article cover"}
                    fetchPriority="high"
                    loading="eager"
                    className="w-full h-[50vh] md:h-[60vh] rounded-lg object-cover object-center"
                />
            )}

            <div className="max-w-5xl mx-auto space-y-5">
                <h2 className="text-4xl font-bold">{title}</h2>
                <p className="text-sm text-gray-500 -mt-5">Last updated: {updatedAt}</p>
                <article className="text-black text-lg font-sans">
                    {typeof content === "string"
                        ? JSON.parse(content).ops.map((block, index) => (
                            <p key={index}>{block.insert}</p>
                        ))
                        : content.ops.map((block, index) => <p key={index}>{block.insert}</p>)}
                </article>

                <section className="max-w-2xl mx-auto">
                    <CommentList comments={data.commentTree} articleId={id} />
                </section>
            </div>
        </main>
    );
}
