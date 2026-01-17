import { handleRejectedCommentService } from "../services/commentStatsService.js";

export async function trackRejectedComments(req, res, code = 403, reason) {
    const models = req.app.locals.models;
    const userId = req.user?.id || req.visitor_id;
    if (!models || !userId) return res.status(500).json({ error: "Internal Server Error" });

    await handleRejectedCommentService(userId, models);

    return res.status(code).json({ error: reason });
}

export async function preventCommentSpamDoxx(req, res, next) {
    const comment = req.body.text;
    if (!comment || comment.length < 1)
        return trackRejectedComments(req, res, 400, "Your comment must contain a text");

    const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
    const phoneRegex =
        /\b(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{2,4}[\s.-]?\d{2,4}[\s.-]?\d{2,4}\b/g;
    const urlRegex = /\b(?:(?:https?:\/\/)|(?:www\.))?[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s]*)?\b/gi;

    if (comment.match(emailRegex) || comment.match(phoneRegex) || comment.match(urlRegex))
        return trackRejectedComments(
            req,
            res,
            400,
            "Your comment cannot contain email, phone numbers or URLs"
        );

    const honeypot = req.body.honey;
    if (honeypot) return trackRejectedComments(req, res, 403, "Bot detected");

    next();
}

export function preventFastComments(req, res, next) {
    const minDelay = 5000;
    const formLoadedAt = Number(req.body.formLoadedAt);
    if (!formLoadedAt || Date.now() - formLoadedAt < minDelay) {
        return trackRejectedComments(req, res, 403, "You're commenting too fast");
    }

    next();
}

export async function rateLimitComments(req, res, next) {
    const models = req.app.locals.models;
    const userId = req.user.id;
    const { CommentStats } = models;

    const stats = await CommentStats.findOne({ where: { userId } });

    const now = new Date();

    if (stats) {
        const diffMs = now - new Date(stats.lastCommentAt);
        if (diffMs < 10000) {
            return trackRejectedComments(req, res, 403, "Delay between two comments too short");
        }
    }

    next();
}
