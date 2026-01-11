import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetAllArticles = () => {
    return useQuery({
        queryKey: ["articles"],
        queryFn: async () => {
            const response = await axios.get("/api/articles");
            return response.data;
        },
    });
};
