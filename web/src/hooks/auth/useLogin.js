import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ email, password }) => {
            const response = await axios.post(
                "/api/login",
                { email, password },
                { withCredentials: true }
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["me"] });
        },
        onError: (error) => {
            console.error("Erreur login:", error);
        },
    });
};
