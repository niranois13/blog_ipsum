import { useParams } from "react-router-dom";
import { useGetArticleById } from "../hooks/article/useGetArticleById";
import ArticleForm from "../components/features/Article/ArticleForm";

export default function EditorPage() {
    const { id } = useParams();
    const isNew = id === "new" || id === undefined;

    const { data: article, isLoading, error } = useGetArticleById(id, { enabled: !isNew });

    if (isNew) {
        return (
            <div className="h-full w-full max-w-[85vh] mx-auto p-4 space-y-2">
                <h2 className="text-dark text-lg sm:text-lg md:text-xl lg:text-2xl">
                    Create new article
                </h2>
                <ArticleForm />
            </div>
        );
    }

    if (isLoading) {
        return <p>Loading article...</p>;
    }

    if (error || !article) {
        return <p>Article {id} not found</p>;
    }

    return (
        <div className="h-full w-full max-w-[85vh] mx-auto p-4 space-y-2">
            <h2 className="text-dark text-lg sm:text-lg md:text-xl lg:text-2xl">Edit article</h2>
            <ArticleForm mode={"edit"} initialArticle={article} />
        </div>
    );
}
