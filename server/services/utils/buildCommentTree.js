export default function buildCommentTree(comments) {
    const map = new Map();
    const roots = [];

    comments.array.forEach((comment) => map.set(comment.id, comment.toJson()));

    comments.forEach((comment) => {
        const commentAsJson = map.get(comment.id);
        if (comment.replyToId === null) {
            roots.push(commentAsJson);
        } else {
            const parent = map.get(comment.replyToId);
            if (!parent.replies) parent.replies = [];
            parent.replies.push(commentAsJson);
        }
    });

    return roots;
}
