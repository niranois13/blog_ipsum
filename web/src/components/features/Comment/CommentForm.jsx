import { useState } from "react";
import { useCreateComment } from "../../../hooks/comments/useCreateComment";

export default function CommentForm({ articleId, replyToId = null, onSuccess }) {
    const [text, setText] = useState("");
    const [honey, setHoney] = useState("");
    const [formLoadedAt] = useState(Date.now());
    const createCommentMutation = useCreateComment(articleId, replyToId, onSuccess);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        createCommentMutation.mutate({
            articleId,
            replyToId,
            text: text.trim(),
            honey: honey,
            formLoadedAt: formLoadedAt,
        });
        setText("");
        setHoney("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
            <textarea
                value={text}
                name="comment reply field"
                onChange={(e) => setText(e.target.value)}
                placeholder={replyToId ? "Reply..." : "Post a comment..."}
                className="p-2 border rounded-md w-full"
                rows={3}
            />
            <input
                type="text"
                name="website"
                tabIndex="-1"
                autoComplete="off"
                className="hidden"
                onChange={(e) => setHoney(e.target.value)}
                value={honey}
            />
            <button type="submit" className="self-end px-4 py-2 bg-primary text-light rounded-md">
                {replyToId ? "Reply" : "Post Comment"}
            </button>
        </form>
    );
}
