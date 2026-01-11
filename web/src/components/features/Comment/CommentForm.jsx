import { useState } from "react";
import { useCreateComment } from "../../../hooks/comments/useCreateComment";

export default function CommentForm({ articleId, replyToId = null, onSuccess }) {
    const [text, setText] = useState("");
    const createCommentMutation = useCreateComment(articleId, replyToId, onSuccess);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Comment to be submitted:", { articleId, replyToId, text: text.trim() });
        if (!text.trim()) return;
        createCommentMutation.mutate({ articleId, replyToId, text: text.trim() });
        setText("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={replyToId ? "Reply..." : "Post a comment..."}
                className="p-2 border rounded-md w-full"
                rows={3}
            />
            <button type="submit" className="self-end px-4 py-2 bg-primary text-light rounded-md">
                {replyToId ? "Reply" : "Post Comment"}
            </button>
        </form>
    );
}
