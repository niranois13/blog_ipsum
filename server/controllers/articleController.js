import {
    updateArticleService,
    getAllArticlesService,
    getHomepageArticlesService,
    getArticleByIdService,
    deleteArticleService,
    createArticleService,
    archiveArticleService,
} from "../services/articleService.js";
import serializeArticle from "../utils/serializeArticle.js";
import { myError } from "../utils/errors.js";

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
    const { title, summary, content, coverID, coverAlt, status } = input;

    if (!status || !content) {
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

    if (status === "PUBLISHED") {
        if (!coverID || typeof coverID !== "string" || coverID.trim().length === 0) {
            return {
                valid: false,
                error: "Cover is required and must be a valid Cloudinary URL for published articles",
            };
        }
        if (!coverAlt || typeof coverAlt !== "string" || coverAlt.trim().length === 0) {
            return {
                valid: false,
                error: "A cover alt field is mandatory for accessibility purposes.",
            };
        }
    } else {
        if (coverID) {
            if (typeof coverID !== "string" || coverID.trim().length === 0) {
                return { valid: false, error: "Cover must be a valid Cloudinary URL if provided" };
            }
            if (!coverAlt || typeof coverAlt !== "string" || coverAlt.trim().length === 0) {
                return { valid: false, error: "An alt field is required for cover images" };
            }
        }
    }

    const safeTitle = formatInvalidTitle(title);
    const safeSummary = formatInvalidSummary(summary);

    return {
        valid: true,
        data: {
            title: safeTitle,
            summary: safeSummary,
            content,
            coverID: coverID || null,
            coverAlt: coverAlt || null,
            status,
        },
    };
}

export async function createArticle(req, res) {
    const models = req.app.locals.models;
    if (!models) return res.status(500).json({ error: "No valid model" });

    if (typeof req.body.content === "string") {
        try {
            req.body.content = JSON.parse(req.body.content);
        } catch {
            return res.status(400).json({ error: "Invalid content format" });
        }
    }

    const validation = validateArticle(req.body, false);
    if (!validation.valid) return res.status(400).json({ error: validation.error });

    validation.data.userId = req.user.id;

    try {
        const article = await createArticleService(validation.data, models);

        return res.status(201).json({ article });
    } catch (error) {
        const status = error instanceof myError ? error.statusCode : 500;
        return res.status(status).json({ error: error.message });
    }
}

export async function getHomepageArticles(req, res) {
    const models = req.app.locals.models;
    if (!models) return res.status(404).json({ error: "Not found" });

    try {
        const articles = await getHomepageArticlesService(models);
        const articlesData = articles?.Articles;
        if (!articlesData) return res.status(404).json({ error: "No article found" });

        const { latestArticle, otherLatestArticles, allOtherArticles } = articlesData;
        if (!latestArticle || latestArticle.length === 0)
            return res.status(404).json({ error: "No article found" });
        const serializedLatestArticle = latestArticle ? serializeArticle(latestArticle) : null;

        if (!otherLatestArticles || otherLatestArticles.length === 0)
            return res.status(404).json({ error: "Not found" });
        const serializedOtherLatestArticles = otherLatestArticles
            ? otherLatestArticles.map(serializeArticle)
            : null;

        if (!allOtherArticles || allOtherArticles.length === 0)
            return res.status(404).json({ error: "Not found" });
        const serializedAllOtherArticles = allOtherArticles
            ? allOtherArticles.map(serializeArticle)
            : null;

        return res.status(200).json({
            latestArticle: serializedLatestArticle,
            otherLatestArticles: serializedOtherLatestArticles,
            allOtherArticles: serializedAllOtherArticles,
        });
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

        const serializedArticles = articles.map(serializeArticle);

        return res.status(200).json(serializedArticles);
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
        const { article, commentTree } = await getArticleByIdService(id, models);

        const serializedArticle = { article: serializeArticle(article), commentTree };

        return res.status(200).json(serializedArticle);
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

    if (typeof req.body.content === "string") {
        try {
            req.body.content = JSON.parse(req.body.content);
        } catch {
            return res.status(400).json({ error: "Invalid content format" });
        }
    }

    const { article } = await getArticleByIdService(id, models);
    if (!article) return res.status(404).json({ error: "Not Found" });

    if (!req.body.coverID) req.body.coverID = article.coverID;

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

export async function archiveArticle(req, res) {
    const models = req.app.locals.models;
    const id = req.params.id;
    if (!models) return res.status(500).json({ error: "No valid model" });
    if (!id) return res.status(404).json({ error: "Not Found" });

    try {
        const article = await archiveArticleService(id, models);

        return res.status(200).json({ article });
    } catch (error) {
        const status = error instanceof myError ? error.statusCode : 500;
        return res.status(status).json({ error: error.message });
    }
}
