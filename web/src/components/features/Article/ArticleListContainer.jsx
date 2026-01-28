import { Triangle } from "lucide-react";
import ArticleList from "./ArticleList";
import { useGetHomepageArticles } from "../../../hooks/article/useGetHomepageArticles";

export default function ArticleListContainer() {
    const { data, isLoading } = useGetHomepageArticles();
    if (isLoading) return <p>Loading latest article</p>;
    if (!data) return <p>No article found</p>;
    console.log("data received by ArticleListContainer:", data);
    const { randomArticles } = data;

    return (
        <section className="w-full font-sans font-dark">
            <div className="mx-auto w-full max-w-7xl flex flex-col gap-4">
                {randomArticles.length > 0 ? (
                    <>
                        <div className="flex gap-5 items-center">
                            <Triangle className="rotate-90 fill-current text-accent" />
                            <h3 className="text-3xl text-dark font-bold">Not to be missed:</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {randomArticles[0] ? <ArticleList {...randomArticles[0]} /> : null}
                            {randomArticles[1] ? <ArticleList {...randomArticles[1]} /> : null}
                            {randomArticles[2] ? <ArticleList {...randomArticles[2]} /> : null}
                            {randomArticles[3] ? <ArticleList {...randomArticles[3]} /> : null}
                            {randomArticles[4] ? <ArticleList {...randomArticles[4]} /> : null}
                            {randomArticles[5] ? <ArticleList {...randomArticles[5]} /> : null}
                        </div>
                    </>
                ) : null}
            </div>
        </section>
    );
}
