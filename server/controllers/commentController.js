import {
    createCommentService,
    getAllCommentsService,
    getCommentByIdService,
    deleteCommentByIdService,
    updateCommentByIdService,
} from "../services/commentService.js";
import { myError } from "../utils/errors.js";

const uuid4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function createComment(req, res) {
    const models = req.app.locals.models;
    if (!models) return res.status(500).json("No model found");

    const { replyToId, text } = req.body;

    if (!text || typeof text !== "string") return res.status(400).json("Invalid comment format");

    const textCheck = text.trim();
    if (textCheck.length < 1 || textCheck.length > 1000)
        return res.status(400).json("A comment must have between 1 and 1000 characters.");

    if (replyToId !== null && (typeof replyToId !== "string" || uuid4Regex.test(replyToId)))
        return res.status(400).json("Invalid comment's parent ID");

    try {
        const comment = await createCommentService(
            {
                replyToId,
                textCheck,
            },
            models
        );

        return res.status(201).json({ comment });
    } catch (error) {
        const status = error instanceof myError ? error.statusCode : 500;
        return res.status(status).json({ error: error.message });
    }
}

export async function getAllComments(req, res) {
    const models = req.app.locals.models;
    if (!models) return res.status(500).json("No model found");

    try {
        const comments = await getAllCommentsService(models);

        return res.status(201).json(comments);
    } catch (error) {
        const status = error instanceof myError ? error.statusCode : 500;
        return res.status(status).json({ error: error.message });
    }
}

export async function getCommentById(req, res) {
    const models = req.app.locals.models;
    if (!models) return res.status(500).json("No model found");

    const id = req.params.id;
    if (!id) return res.status(404).json("Not found");

    try {
        const comment = await getCommentByIdService(id, models);

        return comment;
    } catch (error) {
        const status = error instanceof myError ? error.statusCode : 500;
        return res.status(status).json({ error: error.message });
    }
}

export async function deleteCommentById(req, res) {
    const models = req.app.locals.models;
    if (!models) return res.status(500).json("No model found");

    const id = req.params.id;
    if (!id) return res.status(404).json("Not found");

    try {
        const comment = await deleteCommentByIdService(id, models);

        return comment;
    } catch (error) {
        const status = error instanceof myError ? error.statusCode : 500;
        return res.status(status).json({ error: error.message });
    }
}

export async function updateCommentById(req, res) {
    const models = req.app.locals.models;
    if (!models) return res.status(500).json("No model found");

    const id = req.params.id;
    if (!id) return res.status(404).json("Not found");

    const { replyToId, text } = req.body;

    if (!text || typeof text !== "string") return res.status(400).json("Invalid comment format");

    const textCheck = text.trim();
    if (textCheck.length < 1 || textCheck.length > 1000)
        return res.status(400).json("A comment must have between 1 and 1000 characters.");

    if (replyToId !== null && (typeof replyToId !== "string" || uuid4Regex.test(replyToId)))
        return res.status(400).json("Invalid comment's parent ID");

    try {
        const comment = await updateCommentByIdService(
            {
                replyToId,
                textCheck,
            },
            id,
            models
        );

        return comment;
    } catch (error) {
        const status = error instanceof myError ? error.statusCode : 500;
        return res.status(status).json({ error: error.message });
    }
}
