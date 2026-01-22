import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useGetArticleById } from "../hooks/article/useGetArticleById";
import CommentList from "../components/features/Comment/CommentList";
import { parseArticleContent, quillDeltaToCleanHtml } from "../utils/formatArticle";
import { usePreferences } from "../context/PreferencesContext";
import VideoPlaceholder from "../components/ui/VideoPlaceholder";
import hydrateVideoPlaceholder from "../utils/hydrateVideoPlaceholder";

export default function ArticlePage() {
    const { id } = useParams();
    const { data, isLoading, isError, error } = useGetArticleById(id);
    const { preferencesConsent } = usePreferences();

    const articleRef = useRef(null);

    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdn.quilljs.com/1.3.6/quill.snow.css";
        link.id = "quill-css";
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, []);

    useEffect(() => {
        if (!articleRef.current) return;
        console.log("Hydrating placeholders in:", articleRef.current);
        console.log(
            "Article ref current:",
            articleRef.current.querySelectorAll("[data-video-placeholder-react]")
        );
        hydrateVideoPlaceholder(articleRef.current, <VideoPlaceholder />);
    }, [data, preferencesConsent]);

    if (isLoading) return <p>Loading article...</p>;
    if (isError) return <p>Error: {error?.message || "Could not fetch article."}</p>;
    if (!data.article) return <p>Article not found</p>;
    if (!data.commentTree) return;

    const { title, content, coverUrl, coverAlt, updatedAt } = data.article;
    console.log("Initial content:", content);
    const parsedContent = parseArticleContent(content);
    const cleanContent = quillDeltaToCleanHtml(parsedContent, preferencesConsent);

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
                <article className="ql-snow">
                    <div
                        ref={articleRef}
                        className="ql-editor"
                        dangerouslySetInnerHTML={{ __html: cleanContent }}
                    />
                </article>

                <section className="max-w-2xl mx-auto">
                    <CommentList comments={data.commentTree} articleId={id} />
                </section>
            </div>
        </main>
    );
}
