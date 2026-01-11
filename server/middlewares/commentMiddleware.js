const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const phoneRegex =
    /\b(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{2,4}[\s.-]?\d{2,4}[\s.-]?\d{2,4}\b/g;
const urlRegex = /\b(?:(?:https?:\/\/)|(?:www\.))?[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s]*)?\b/gi;

export async function preventCommentSpamDoxx(req, res, next) {
    const comment = req.body.text;
    if (!comment || comment.length < 1)
        return res.status(500).json({ error: "Your comment must contain a text" });

    if (comment.match(emailRegex) || comment.match(phoneRegex) || comment.match(urlRegex))
        return res
            .status(400)
            .json({ error: "Your comment cannot contain email, phone numbers or URLs" });

    next();
}
