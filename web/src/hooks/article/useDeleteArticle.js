import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";

export const useDeleteArticle = (onSuccessCb) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => {
            const request = axios.delete(`/api/admin/articles/${id}`, {
                withCredentials: true,
            });

            return toast.promise(request, {
                loading: "Deleting article...",
                success: "Article successfully deleted",
                error: "Failed to delete article",
            });
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["articles"] });
            await new Promise((r) => setTimeout(r, 800));
            onSuccessCb?.();
        },
    });
};
