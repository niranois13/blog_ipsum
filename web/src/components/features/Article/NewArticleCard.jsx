import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import AdminButton from "../../ui/AdminButton";
import { FilePenLine, FileDown, FileX } from "lucide-react";
import formatDate from "../../../utils/formatDate";
import { useArchiveArticle } from "../../../hooks/article/useArchiveArticle";
import { useDeleteArticle } from "../../../hooks/article/useDeleteArticle";

export default function NewArticleCard({
    id,
    title,
    summary,
    coverUrl,
    coverAlt,
    updatedAt,
    className = "",
}) {
    const { isLoggedIn } = useAuth();

    const archiveMutation = useArchiveArticle();

    const handleArchive = () => {
        console.log("archiveMutation called");
        archiveMutation.mutate(id);
    };

    const deleteMutation = useDeleteArticle();

    const handleDelete = () => {
        if (!confirm("Delete this article permanently?")) return;
        deleteMutation.mutate(id);
    };

    return (
        <article
            className={`
                rounded-lg border border-primary
                bg-bg
                overflow-hidden
                flex flex-col
                group
                transition-transform duration-300 ease-out
                hover:-translate-y-1
                ${className}
                focus-within:ring-2
                focus-within:ring-primary
                focus-within:ring-offset-2
                focus-within:ring-offset-bg
                `}
        >
            <Link to={`/article/${id}`} className="block ">
                {/* New article insert */}
                <div className="text-center bg-primary">
                    <p className="text-light rounded-t-lg">Latest Article</p>
                </div>

                {/* Image */}
                <div
                    className="
                        aspect-2/1 md:aspect-4/1
                        overflow-hidden
                        "
                >
                    <img
                        src={coverUrl}
                        alt={coverAlt}
                        className="
                            w-full h-full object-cover object-center
                            transition-transform duration-300 ease-out
                            group-hover:scale-105"
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                    />
                </div>
            </Link>

            {/* Text content */}
            <div className="flex flex-col p-2 lg:p-4 font-sans text-dark">
                {/* Title */}
                <div className="flex justify-between items-center">
                    <h2
                        className="
                                py-1
                                text-lg font-bold
                                sm:text-xl sm:px-1
                                md:text-3xl md:px-2
                                lg:text-4xl lg:px-3
                                line-clamp-1"
                    >
                        {title}
                    </h2>
                    {isLoggedIn && (
                        <div className="flex flex-wrap gap-2">
                            <AdminButton
                                Icon={FilePenLine}
                                buttonText="Edit article"
                                linkTo={`/editor/${id}`}
                                txtClassName="sr-only md:not-sr-only"
                            />
                            <AdminButton
                                Icon={FileDown}
                                buttonText="Archive article"
                                onClick={handleArchive}
                                txtClassName="sr-only md:not-sr-only"
                            />
                            <AdminButton
                                Icon={FileX}
                                buttonText="Delete article"
                                onClick={handleDelete}
                                txtClassName="sr-only md:not-sr-only"
                            />
                        </div>
                    )}
                </div>

                {/* Date */}
                <p
                    className="
                                text-xs font-light
                                sm:text-xs sm:px-1
                                md:text-sm md:px-2
                                lg:text-md lg:px-3"
                >
                    Last update: {formatDate(updatedAt)}
                </p>

                {/* Summary */}
                <p
                    className="
                            text-sm text-justify
                            mt-1
                            sm:px-1 sm:mt-2
                            md:text-md md:px-2 md:mt-3
                            lg:tex-lg lg:px-3 lg:mt-4
                            "
                >
                    {summary}
                </p>
            </div>
        </article>
    );
}
