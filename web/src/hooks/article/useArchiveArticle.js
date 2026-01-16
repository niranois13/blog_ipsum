import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export const useArchiveArticle = (onSuccessCb) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => {
            const request = axios.patch(`/api/admin/articles/${id}/archive`, null, {
                withCredentials: true,
            });

            return toast.promise(request, {
                loading: "Archiving article...",
                success: "Article successfully archived",
                error: "Failed to archive article",
            });
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["articles"] });
            await new Promise((r) => setTimeout(r, 800));
            onSuccessCb?.();
        },
    });
};
