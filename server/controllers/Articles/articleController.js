import {
    updateArticleService,
    getAllArticlesService,
    getArticleByIdService,
    deleteArticleService,
    createArticleService,
} from "../../services/articleService.js";
import { myError } from "../../utils/errors.js";

// function checkCloudinaryObject(responseCloudinary) {
//     if (typeof responseCloudinary !== "object")
//         return false;
//     if (responseCloudinary.resource_type !== "image")
//         return false;
//     if (!["jpg", "jpeg", "png", "webp", "avif"].includes(responseCloudinary.format))
//         return false;
//     if (!responseCloudinary.secure_url.startsWith('https://res.cloudinary.com/'))
//         return false;
//     return true;
// }

function checkQuillObject(content) {
    if (typeof content !== "object") return false;
    if (!Array.isArray(content.ops)) return false;
    for (const op of content.ops) {
        if (typeof op !== "object" || !("insert" in op)) return false;
    }
    return true;
}

function formatInvalidTitle(title) {
    if (typeof title !== "string" || title.length < 1 || title.length > 120) {
        const date = new Date();
        const day = date.toLocaleDateString("fr-FR", { timeZone: "UTC" });
        const hours = date.toLocaleTimeString("fr-FR", { timeZone: "UTC", hour12: false });
        title = `New article: ${day} - ${hours} UTC`;
    }
    return title;
}

function formatInvalidSummary(summary) {
    if (typeof summary !== "string" || summary.length < 1 || summary.length > 400) {
        summary = "Enter a valid summary of the article, max 400 characters.";
    }
    return summary;
}

function validateArticle(input, isUpdate) {
    const { title, summary, content, cover, status } = input;

    if (!status || !content || !cover) {
        return { valid: false, error: "Missing Parameters" };
    }

    let allowedStatus = [];
    if (isUpdate) {
        allowedStatus = ["DRAFT", "PUBLISHED", "ARCHIVED"];
    } else {
        allowedStatus = ["DRAFT", "PUBLISHED"];
    }
    if (!allowedStatus.includes(status)) return { valid: false, error: "Invalid status" };

    if (!checkQuillObject(content)) return { valid: false, error: "Invalid Quill content" };

    if (typeof cover !== "string" || !cover.startsWith("https://res.cloudinary.com/"))
        return { valid: false, error: "Invalid Cloudinary content" };

    const safeTitle = formatInvalidTitle(title);
    const safeSummary = formatInvalidSummary(summary);

    return {
        valid: true,
        data: {
            title: safeTitle,
            summary: safeSummary,
            content,
            cover,
            status,
        },
    };
}

export async function createArticle(req, res) {
    const models = req.app.locals.models;
    if (!models) return res.status(500).json({ error: "No valid model" });

    const validation = validateArticle(req.body, false);
    if (!validation.valid) return res.status(400).json({ error: validation.error });

    try {
        const article = await createArticleService(validation.data, models);

        return res.status(201).json({ article });
    } catch (error) {
        const status = error instanceof myError ? error.statusCode : 500;
        return res.status(status).json({ error: error.message });
    }
}

export async function getAllArticles(req, res) {
    const models = req.app.locals.models;
    if (!models) return res.status(404).json({ error: "Not found" });

    try {
        const articles = await getAllArticlesService(models);

        return res.status(200).json(articles);
    } catch (error) {
        const status = error instanceof myError ? error.statusCode : 500;
        return res.status(status).json({ error: error.message });
    }
}

export async function getArticleById(req, res) {
    const models = req.app.locals.models;
    const id = req.params.id;
    if (!models || !id) return res.status(404).json({ error: "Not found" });

    try {
        const article = await getArticleByIdService(id, models);

        return res.status(200).json(article);
    } catch (error) {
        const status = error instanceof myError ? error.statusCode : 500;
        return res.status(status).json({ error: error.message });
    }
}

export async function deleteArticle(req, res) {
    const models = req.app.locals.models;
    const id = req.params.id;
    if (!models || !id) return res.status(404).json({ error: "Not found" });

    try {
        const article = await deleteArticleService(id, models);

        return res.status(200).json(article);
    } catch (error) {
        const status = error instanceof myError ? error.statusCode : 500;
        return res.status(status).json({ error: error.message });
    }
}

export async function updateArticle(req, res) {
    const models = req.app.locals.models;
    const id = req.params.id;
    if (!models) return res.status(500).json({ error: "No valid model" });
    if (!id) return res.status(404).json({ error: "Not Found" });

    const validation = validateArticle(req.body, true);
    if (!validation.valid) return res.status(400).json({ error: validation.error });

    try {
        const article = await updateArticleService(validation.data, id, models);

        return res.status(200).json({ article });
    } catch (error) {
        const status = error instanceof myError ? error.statusCode : 500;
        return res.status(status).json({ error: error.message });
    }
}
