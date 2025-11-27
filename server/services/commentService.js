import buildCommentTree from "./utils/buildCommentTree.js";

export async function createCommentService(data, models) {
    const { Comment } = models;

    return await Comment.create({
        text: data.text,
        replyToId: data.replyToId,
    });
}

export async function getAllCommentsService(models) {
    const { Comment } = models;

    const comments = await Comment.findAll({
        order: [["createdAt", "ASC"]],
    });
    if (!comments) throw new Error("No comment found");

    const commentTree = buildCommentTree(comments);

    return commentTree;
}

export async function getCommentByIdService(commentId, models) {
    const { Comment } = models;

    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error("No comment found");

    return comment;
}

export async function deleteCommentByIdService(commentId, models) {
    const { Comment } = models;

    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error("No comment found");

    comment.destroy();

    return comment;
}

export async function updateCommentByIdService(commentId, data, models) {
    const { Comment } = models;

    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error("Comment not found");

    await comment.update(data);

    return comment;
}
