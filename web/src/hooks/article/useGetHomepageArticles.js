import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetHomepageArticles = () => {
    return useQuery({
        queryKey: ["articles"],
        queryFn: async () => {
            const response = await axios.get("/api/articles/homepage");
            return response.data;
        },
        staleTime: 1000 * 300,
        select: (data) => {
            const { latestArticle, otherLatestArticles, allOtherArticles } = data;
            const randomArticles = getRandomArticles(allOtherArticles, 6);

            return { latestArticle, otherLatestArticles, randomArticles };
        },
    });
};

function getRandomArticles(articles, count) {
    if (!articles || articles.length == 0) return [];

    const shuffled = [...articles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}
