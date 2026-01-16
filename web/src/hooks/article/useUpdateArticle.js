import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";

export const useUpdateArticle = (onSuccessCb) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => {
            const formData = new FormData();

            formData.append("title", data.title);
            formData.append("summary", data.summary);
            formData.append("status", data.status);
            formData.append("content", JSON.stringify(data.content));
            formData.append("coverAlt", data.coverAlt);

            if (typeof data.coverID === "string" && data.coverID.length > 0)
                formData.append("coverID", data.coverID);

            if (data.cover instanceof File) {
                formData.append("cover", data.cover);
            }

            const debugData = {};
            for (const [key, value] of formData.entries()) {
                debugData[key] = value;
            }

            const request = axios.put(`/api/admin/articles/${id}`, formData, {
                withCredentials: true,
            });

            return toast.promise(request, {
                loading: "Updating article...",
                success: "Article successfully updated",
                error: "Failed to update article",
            });
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["articles"] });
            await new Promise((r) => setTimeout(r, 800));
            onSuccessCb?.();
        },
    });
};
