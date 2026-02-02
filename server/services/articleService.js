import { myError } from "../utils/errors.js";
import buildCommentTree from "../utils/buildCommentTree.js";
import { redisClient } from "../redis/redisClient.js";

const HOMEPAGE_TTL = 120;
const ALL_ARTICLES_TTL = 300;
const ARTICLE_BY_ID_TTL = 900;
const COMMENTS_TTL = 600;
const redis = redisClient;

export async function createArticleService(data, models) {
    const { Article } = models;

    const article = await Article.create({
        title: data.title,
        coverID: data.coverID,
        coverAlt: data.coverAlt,
        summary: data.summary,
        content: data.content,
        status: data.status,
        userId: data.userId,
    });

    if (data.status === "PUBLISHED") await redis.del("articles:homepage");
    await redis.del("articles:all");

    return article;
}

export async function updateArticleService(data, articleId, models) {
    const { Article } = models;

    await redis.del(`article:${articleId}`);
    await redis.del("articles:homepage");
    await redis.del("articles:all");

    const article = await Article.findByPk(articleId);
    if (!article) throw new myError("Article not found", 404);

    await article.update(data);

    return article;
}

export async function getAllArticlesService(models) {
    const { Article } = models;
    const cacheKey = "articles:all";
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

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
    const articlesJSON = articles.map((a) => a.toJSON());

    if (!articles.length) return [];
    await redis.set(cacheKey, JSON.stringify(articlesJSON), { EX: ALL_ARTICLES_TTL });

    return articlesJSON;
}

export async function getHomepageArticlesService(models) {
    const cacheKey = "articles:homepage";
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const { Article } = models;

    const allPublishedArticles = await Article.findAll({
        where: { status: "PUBLISHED" },
        attributes: ["id", "title", "summary", "coverID", "coverAlt", "updatedAt"],
        order: [["updatedAt", "DESC"]],
    });

    if (!allPublishedArticles.length) return { Articles: {} };
    const allPublishedArticlesJSON = allPublishedArticles.map((a) => a.toJSON());

    const result = {
        Articles: {
            latestArticle: allPublishedArticlesJSON[0],
            otherLatestArticles: allPublishedArticlesJSON.slice(1, 4),
            allOtherArticles: allPublishedArticlesJSON.slice(4),
        },
    };

    await redis.set(cacheKey, JSON.stringify(result), { EX: HOMEPAGE_TTL });

    return result;
}

export async function getArticleByIdService(articleId, models) {
    const articleKey = `article:${articleId}`;
    const commentsKey = `article:${articleId}:comments`;

    const cachedArticle = await redis.get(articleKey);
    const cachedComments = await redis.get(commentsKey);

    if (cachedArticle && cachedComments) {
        return {
            article: JSON.parse(cachedArticle),
            commentTree: JSON.parse(cachedComments),
        };
    }

    const { Article, Comment, User } = models;

    const article = await Article.findByPk(articleId);
    if (!article) throw new myError("Article not found", 404);
    const articleJSON = article.toJSON();

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

    await redis.set(articleKey, JSON.stringify(articleJSON), { EX: ARTICLE_BY_ID_TTL });
    await redis.set(commentsKey, JSON.stringify(commentTree), { EX: COMMENTS_TTL });

    return {
        article: articleJSON,
        commentTree,
    };
}

export async function deleteArticleService(articleId, models) {
    const { Article } = models;

    const article = await Article.findByPk(articleId);
    if (!article) throw new myError("Article not found", 404);

    await redis.del(`article:${articleId}`);
    await redis.del("articles:homepage");
    await redis.del("articles:all");

    await article.destroy();

    return article;
}

export async function archiveArticleService(articleId, models) {
    const { Article } = models;

    const article = await Article.findByPk(articleId);
    if (!article) throw new myError("Article not found", 404);

    await redis.del(`article:${articleId}`);
    await redis.del("articles:homepage");
    await redis.del("articles:all");

    await article.update({ status: "ARCHIVED" });

    return article;
}
