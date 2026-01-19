import { myError } from "../utils/errors.js";
import buildCommentTree from "../utils/buildCommentTree.js";

export async function createArticleService(data, models) {
    const { Article } = models;

    return await Article.create({
        title: data.title,
        coverID: data.coverID,
        coverAlt: data.coverAlt,
        summary: data.summary,
        content: data.content,
        status: data.status,
        userId: data.userId,
    });
}

export async function updateArticleService(data, articleId, models) {
    const { Article } = models;

    const article = await Article.findByPk(articleId);
    if (!article) throw new myError("Article not found", 404);

    await article.update(data);

    return article;
}

export async function getAllArticlesService(models) {
    const { Article } = models;

    const articles = await Article.findAll({
        attributes: [
            "id",
            "title",
            "coverID",
            "coverAlt",
            "summary",
            "status",
            "createdAt",
            "updatedAt",
        ],
        order: [["updatedAt", "DESC"]],
    });

    return articles;
}

export async function getHomepageArticlesService(models) {
    const { Article } = models;

    const allPublishedArticles = await Article.findAll({
        where: { status: "PUBLISHED" },
        attributes: ["id", "title", "summary", "coverID", "coverAlt", "updatedAt"],
        order: [["updatedAt", "DESC"]],
        raw: true,
    });

    if (!allPublishedArticles.length) return { Articles: {} };

    const latestArticle = allPublishedArticles[0];
    const otherLatestArticles = allPublishedArticles.slice(1, 4);
    const allOtherArticles = allPublishedArticles.slice(4);

    return {
        Articles: {
            latestArticle,
            otherLatestArticles,
            allOtherArticles,
        },
    };
}

export async function getArticleByIdService(articleId, models) {
    const { Article, Comment, User } = models;

    const article = await Article.findByPk(articleId);
    if (!article) throw new myError("Article not found", 404);

    const comments = await Comment.findAll({
        where: { articleId },
        order: [["createdAt", "ASC"]],
        include: [
            {
                model: User,
                as: "author",
                attributes: ["id", "username", "role"],
            },
        ],
    });

    let commentTree = [];
    if (comments.length > 0) {
        commentTree = buildCommentTree(comments);
    }

    return {
        article,
        commentTree,
    };
}

export async function deleteArticleService(articleId, models) {
    const { Article } = models;

    const article = await Article.findByPk(articleId);
    if (!article) throw new myError("Article not found", 404);

    await article.destroy();

    return article;
}

export async function archiveArticleService(articleId, models) {
    const { Article } = models;

    const article = await Article.findByPk(articleId);
    if (!article) throw new myError("Article not found", 404);

    await article.update({ status: "ARCHIVED" });

    return article;
}
