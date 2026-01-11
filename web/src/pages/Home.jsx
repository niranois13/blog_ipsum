import ArticleContainer from "../components/features/Article/ArticleContainer";
import ArticleListContainer from "../components/features/Article/ArticleListContainer";

export default function MainContent() {
    return (
        <main
            className="bg-bg flex flex-col gap-10 mx-auto w-full
        sm:max-w-[90%]
        md:max-w-[85%]
        lg:max-w-[75%]"
        >
            <ArticleContainer />
            <ArticleListContainer />
        </main>
    );
}
