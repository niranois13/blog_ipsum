import { myError } from "../utils/errors.js";
import { buildCommentTree } from "./utils/buildCommentTree.js";

export async function createArticleService(data, models) {
    const { Article } = models;

    return await Article.create({
        title: data.title,
        cover: data.cover,
        summary: data.summary,
        content: data.content,
        status: data.status,
    });
}

export async function updateArticleService(articleId, data, models) {
    const { Article } = models;

    const article = await Article.findByPk(articleId);
    if (!article)
        throw new myError("Article not found", 404);

    await article.update(data);

    return article;
}

export async function getAllArticlesService(models) {
    const { Article } = models;

    const articles = await Article.findAll({
        order: [["createdAt", "ASC"]],
    });

    return articles;
}

export async function getArticleByIdService(articleId, models) {
    const { Article, Comment } = models;

    const article = await Article.findByPk(articleId);
    if (!article) throw new myError("Article not found", 404);

    const comments = await Comment.findAll({
        where: { id: articleId },
        order: [["createdAt", "ASC"]],
    });

    const commentTree = buildCommentTree(comments);

    return {
        article,
        commentTree,
    };
}

export async function deleteArticleService(articleId, models) {
    const { Article } = models;

    const article = await Article.findByPk(articleId);
    if (!article)
        throw new myError("Article not found", 404);

    await article.destroy();

    return article;
}
