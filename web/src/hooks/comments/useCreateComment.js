import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export const useCreateComment = (articleId, onSuccessCb) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ articleId, replyToId, text, honey, formLoadedAt }) => {
            const request = axios.post(`/api/articles/${articleId}/comments`, {
                replyToId,
                text,
                honey,
                formLoadedAt,
            });

            return toast.promise(request, {
                loading: "Creating comment...",
                success: "Comment successfully created",
                error: "Failed to create comment",
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["articles", articleId] });
            onSuccessCb?.();
        },
    });
};
