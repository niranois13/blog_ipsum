import { useGetHomepageArticles } from "../../../hooks/article/useGetHomepageArticles";
import ArticleCard from "./ArticleCard";
import NewArticleCard from "./NewArticleCard";

export default function ArticleContainer() {
    const { data, isLoading } = useGetHomepageArticles();
    if (isLoading) return <p>Loading latest article</p>;
    if (!data) return <p>No article found</p>;
    const { latestArticle, otherLatestArticles } = data;
    if (!data?.latestArticle || !data?.otherLatestArticles) return <p>No article found</p>;

    return (
        <section
            className="
            grid grid-cols-1
            md:grid-cols-3
            gap-4
            w-full
            mx-auto
            "
        >
            {latestArticle && <NewArticleCard {...latestArticle} className="md:col-span-3" />}
            {otherLatestArticles[0] && <ArticleCard {...otherLatestArticles[0]} />}
            {otherLatestArticles[1] && <ArticleCard {...otherLatestArticles[1]} />}
            {otherLatestArticles[2] && <ArticleCard {...otherLatestArticles[2]} />}
        </section>
    );
}
