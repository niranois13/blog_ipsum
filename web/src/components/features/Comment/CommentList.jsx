import Comment from "./Comment";
import CommentForm from "./CommentForm";

export default function CommentList({ articleId, comments }) {
    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Comments</h2>

            <CommentForm articleId={articleId} />

            <div className="mt-4 space-y-4">
                {comments.length === 0 ? (
                    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => <Comment key={comment.id} comment={comment} />)
                )}
            </div>
        </div>
    );
}
