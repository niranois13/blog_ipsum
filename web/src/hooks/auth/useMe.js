import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useMe() {
    return useQuery({
        queryKey: ["me"],
        queryFn: async () => {
            const res = await axios.get("/api/auth/me", {
                withCredentials: true,
            });
            return res.data.user;
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
}
