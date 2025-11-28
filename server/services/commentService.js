import buildCommentTree from "../utils/buildCommentTree.js";
import { myError } from "../utils/errors.js";

export async function createCommentService(data, models) {
    const { Comment } = models;

    const comment = await Comment.create({
        text: data.text,
        replyToId: data.replyToId,
    });

    return comment;
}

export async function getAllCommentsService(models) {
    const { Comment } = models;

    const comments = await Comment.findAll({
        order: [["createdAt", "ASC"]],
    });
    if (!comments)
        throw new myError("No comment found", 404);

    const commentTree = buildCommentTree(comments);

    return commentTree;
}

export async function getCommentByIdService(commentId, models) {
    const { Comment } = models;

    const comment = await Comment.findByPk(commentId);
    if (!comment)
        throw new myError("No comment found", 404);

    return comment;
}

export async function deleteCommentByIdService(commentId, models) {
    const { Comment } = models;

    const comment = await Comment.findByPk(commentId);
    if (!comment)
        throw new myError("No comment found", 404);

    comment.destroy();

    return comment;
}

export async function updateCommentByIdService(commentId, data, models) {
    const { Comment } = models;

    const comment = await Comment.findByPk(commentId);
    if (!comment)
        throw new myError("Comment not found", 404);

    await comment.update(data);

    return comment;
}
