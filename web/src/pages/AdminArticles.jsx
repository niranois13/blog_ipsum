import { PencilLine, X } from "lucide-react";
import { useGetAllArticles } from "../hooks/article/useGetAllArticle";
import AdminButton from "../components/ui/AdminButton";
import { useNavigate } from "react-router-dom";
import { useDeleteArticle } from "../hooks/article/useDeleteArticle";

export default function AdminArticles() {
    const { data = [], isLoading, error } = useGetAllArticles();
    const articles = Array.isArray(data) ? data : [];
    const navigate = useNavigate();
    const useDeleteMutation = useDeleteArticle();

    return (
        <div className="h-full px-6 py-6 flex flex-col gap-4">
            <h2
                className="
                    text-dark font-sans font-black
                    sm:text-lg md:text-xl lg:text-2xl
                "
            >
                Articles Dashboard
            </h2>
            <AdminButton
                Icon={PencilLine}
                IconSize={24}
                buttonText="Write new Article"
                linkTo="/editor/new"
                divClassName="text-dark flex-row font-sans font-bold gap-3"
                txtClassName="text-xl"
            />

            <section className="space-y-3 flex flex-col items-center mx-auto mt-">
                <h3
                    className="
                    text-dark font-sans font-bold
                    sm:text-md md:text-lg lg:text-xl
                "
                >
                    Articles List
                    {isLoading && (
                        <span className="text-sm font-sans text-dark">Loading articles…</span>
                    )}
                    {error && (
                        <span className="text-sm font-sans text-red-700">
                            Error while fetching articles.
                        </span>
                    )}
                </h3>
                {!articles || articles.length === 0 ? (
                    <p>No articles found yet.</p>
                ) : (
                    <ul className="space-y-3 w-full max-w-[80vw]">
                        {articles.map((article) => (
                            <li
                                key={article.id}
                                onClick={() => navigate(`/editor/${article.id}`)}
                                className="
                                        group flex items-stretch gap-4 p-3 border rounded-lg
                                        cursor-pointer hover:bg-primary/5 transition"
                            >
                                <article className="flex items-center">
                                    <div
                                        className="
                                            max-w-20 max-h-20
                                            aspect-square
                                            overflow-hidden
                                            transition-transform duration-300 ease-out
                                            group-hover:-translate-y-px
                                            group-hover:rotate-[0.3deg]
                                            "
                                    >
                                        <img
                                            src={
                                                article.coverUrl +
                                                "w=400&h=400&c=scale&f=auto&q=auto"
                                            }
                                            alt={article.coverAlt}
                                            className="w-full h-full object-cover object-center"
                                        />
                                    </div>
                                    <div className="p-1 lg:p-3 font-sans text-dark"></div>
                                    <h4
                                        className="
                                            py-1
                                            text-sm font-bold
                                            sm:text-md
                                            md:text-lg md:px-1
                                            lg:text-xl lg:px-2
                                            line-clamp-1
                                            hover:text-black"
                                    >
                                        {article.title}
                                    </h4>

                                    <p
                                        className="
                                            py-1
                                            text-sm
                                            sm:text-md
                                            md:text-lg md:px-1
                                            lg:text-xl lg:px-2
                                            line-clamp-1
                                            "
                                    >
                                        {article.summary}
                                    </p>
                                </article>
                                <button
                                    type="button"
                                    aria-label="delete article"
                                    className="self-start text-dark/60 hover:text-red-500 transition"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (
                                            window.confirm(
                                                "Are you sure you want to delete this article ?"
                                            )
                                        ) {
                                            useDeleteMutation.mutate(article.id);
                                        }
                                    }}
                                >
                                    <X />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
