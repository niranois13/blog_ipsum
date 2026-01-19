import { useState } from "react";
import CommentForm from "./CommentForm";
import formatDate from "../../../utils/formatDate";

export default function Comment({ comment }) {
    const [showReply, setShowReply] = useState(false);

    return (
        <div className="border-l-2 border-gray-300 pl-4 mt-2">
            <p className="text-lg">{comment.text}</p>
            {comment.author?.username && (
                <div>
                    <p className="text-sm">Posted by: {comment.author.username}</p>
                    <time
                        dateTime={comment.ceatedAt}
                        title={new Date(comment.createdAt).toLocaleString()}
                        className="text-sm"
                    >
                        At {formatDate(comment.createdAt)}
                    </time>
                </div>
            )}
            <div className="flex gap-2 mt-1">
                <button className="text-primary text-sm" onClick={() => setShowReply(!showReply)}>
                    Reply
                </button>
            </div>

            {showReply && (
                <div className="ml-4 mt-2">
                    <CommentForm
                        articleId={comment.articleId}
                        replyToId={comment.id}
                        onSuccess={() => setShowReply(!showReply)}
                    />
                </div>
            )}

            {comment.replies?.length > 0 && (
                <div className="ml-4 mt-2 space-y-2">
                    {comment.replies.map((reply) => (
                        <Comment key={reply.id} comment={reply} />
                    ))}
                </div>
            )}
        </div>
    );
}
