import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => axios.post("/api/logout", { withCredentials: true }),
        onSuccess: () => {
            queryClient.setQueryData(["me"], null);
        },
    });
}
