import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetArticleById = (id) => {
    return useQuery({
        queryKey: ["articles", id],
        queryFn: async () => {
            const response = await axios.get(`/api/articles/${id}`);
            console.log("useGetArticleById response:", response.data);
            return response.data;
        },
        enabled: !!id && id !== "new",
    });
};
