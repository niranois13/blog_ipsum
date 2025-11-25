import {
    updateArticleService,
    getAllArticlesService,
    getArticleByIdService,
    deleteArticleService,
    createArticleService
} from "../../services/articleService.js";

function checkQuillObject(content) {
    if (typeof content !== "object")
        return false
    if (!Array.isArray(content.ops))
        return false
    for (const op of content.ops) {
        if (typeof op !== "object" || !('insert' in op))
            return false
    }
    return true
}

function checkCloudinaryObject(responseCloudinary) {
    if (typeof responseCloudinary !== "object")
        return false;
    if (responseCloudinary.resource_type !== "image")
        return false;
    if (!["jpg", "jpeg", "png", "webp", "avif"].includes(responseCloudinary.format))
        return false;
    if (!responseCloudinary.secure_url.startsWith('https://res.cloudinary.com/'))
        return false;
    return true;
}

export async function createArticle(responseCloudinary, req, res) {
    const models = req.app.locals.models;
    if (!models)
        return res.status(404).json({ error: "Not found" });

    let { title, summary, content, status } = req.body
    if (!status || !content || !responseCloudinary) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    let cover = null;

    if (!(["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)))
        return res.status(400).json({ error: "Invalid status." });

    if (!checkQuillObject(content))
        return res.status(400).json({ error: "Invalid Quill content." })

    if (!checkCloudinaryObject(responseCloudinary))
        return res.status(400).json({ error: "Invalid Cloudinary content." })
    cover = responseCloudinary.secure_url || null;

    if (status && status === "DRAFT") {
        if (title == undefined) {
            const date = new Date();
            const day = date.toLocaleDateString("fr-FR", { timeZone: "UTC" });
            const hours = date.toLocaleTimeString("fr-FR", { timeZone: "UTC", hour12: false });
            title = `New draft: ${day} - ${hours} UTC`;
        };
        if (summary == undefined) {
            summary = "Present your article here, max 400 characters.";
        };
    } else {
        title = title.trim();
        summary = summary.trim();
        if ((typeof title !== "string") || title.length < 1 || title.length > 120)
            return res.status(400).json({ error: "Invalid title format" });
        if ((typeof summary !== "string") || summary.length < 1 || summary.length > 400)
            return res.status(400).json({ error: "Invalid summary format" });
    }

    try {
        const article = await createArticleService({
            title,
            cover,
            summary,
            content,
            status
        }, models)

        return res.status(201).json({ article });
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export async function getAllArticles(req, res) {
    const models = req.app.locals.models;
    if (!models)
        return res.status(404).json({ error: "Not found" });

    try {
        const articles = await getAllArticlesService(models)

        return res.status(200).json(articles);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getArticleById(req, res) {
    const models = req.app.locals.models;
    const id = req.params.id
    if (!models || !id)
        return res.status(404).json({ error: "Not found" });

    try {
        const article = await getArticleByIdService(id, models)

        return res.status(200).json(article);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function deleteArticle(req, res) {
    const models = req.app.locals.models;
    const id = req.params.id
    if (!models || !id)
        return res.status(404).json({ error: "Not found" });

    try {
        const article = await deleteArticleService(id, models);

        return res.status(200).json(article);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function updateArticle(responseCloudinary, req, res) {
    const models = req.app.locals.models;
    const id = req.params.id;
    if (!models || !id)
        return res.status(404).json({ error: "Not found" });

    let { title, summary, content, status } = req.body
    if (!status || !content || !responseCloudinary) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    let cover = null;

    if (!(["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)))
        return res.status(400).json({ error: "Invalid status." });

    if (!checkQuillObject(content))
        return res.status(400).json({ error: "Invalid Quill content." })

    if (!checkCloudinaryObject(responseCloudinary))
        return res.status(400).json({ error: "Invalid Cloudinary content." })
    cover = responseCloudinary.secure_url || null;

    if (status && status === "DRAFT") {
        if (title == undefined || title.startsWith('New draft:')) {
            const date = new Date();
            const day = date.toLocaleDateString("fr-FR", { timeZone: "UTC" });
            const hours = date.toLocaleTimeString("fr-FR", { timeZone: "UTC", hour12: false });
            title = `New draft: ${day} - ${hours} UTC`;
        };
        if (summary == undefined) {
            summary = "Present your article here, max 400 characters.";
        };
    } else {
        title = title.trim();
        summary = summary.trim();
        if ((typeof title !== "string") || title.length < 1 || title.length > 120)
            return res.status(400).json({ error: "Invalid title format" });
        if ((typeof summary !== "string") || summary.length < 1 || summary.length > 400)
            return res.status(400).json({ error: "Invalid summary format" });
    }

    try {
        const article = await updateArticleService({
            title,
            cover,
            summary,
            content,
            status
        }, models)

        return res.status(200).json({ article });
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
