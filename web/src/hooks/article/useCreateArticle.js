import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";

export const useCreateArticle = (onSuccessCb) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ title, cover, coverAlt, summary, content, status }) => {
            const formData = new FormData();

            formData.append("title", title);
            formData.append("summary", summary);
            formData.append("status", status);
            formData.append("content", JSON.stringify(content));
            formData.append("coverAlt", coverAlt);

            if (cover instanceof File) {
                formData.append("cover", cover);
            }

            const request = axios.post("/api/admin/articles", formData, {
                withCredentials: true,
            });

            return toast.promise(request, {
                loading: "Creating article...",
                success: "Article successfully created",
                error: "Failed to create article",
            });
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["articles"] });
            await new Promise((r) => setTimeout(r, 800));
            onSuccessCb?.();
        },
    });
};
