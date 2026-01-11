import { Link } from "react-router-dom";

export default function ArticleList({ id, title, coverUrl, coverAlt }) {
    return (
        <article className="group w-full">
            <Link to={`/article/${id}`} className="flex w-full items-center">
                {/* Image */}
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
                        src={coverUrl}
                        alt={coverAlt}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                    />
                </div>

                {/* Text content */}
                <div className="p-1 lg:p-3 font-sans text-dark flex-1">
                    {/* Title */}
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
                        {title}
                    </h4>
                </div>
            </Link>
        </article>
    );
}
