export async function createArticleService(data, models) {
    try {
        const { Article } = models;

        return await Article.create({
            title: data.title,
            cover: data.cover,
            summary: data.summary,
            content: data.content,
            status: data.status
        });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError")
            throw new Error("Duplicate entry in postArticle");

        throw error;
    }
}

export async function updateArticleService(articleId, data, models) {
    try {
        const { Article } = models;

        const article = await Article.findByPk(articleId);
        if (!article)
            throw new Error("User not found");

        await article.update(data);

        return article;
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError")
            throw new Error("Duplicate entry in patchArticle")

        throw error;
    }
}

export async function getAllArticlesService(models) {
    try {
        const { Article } = models;

        const articles = await Article.findAll({
            order: [
                ['createdAt', 'ASC']
            ]
        });

        return articles;
    } catch (error) {
        throw error;
    }
}

export async function getArticleByIdService(articleId, models) {
    try {
        const { Article } = models;

        const article = await Article.findByPk(articleId);
        if (!article)
            throw new Error("Article not found");

        return article;
    } catch (error) {
        throw error;
    }
}

export async function deleteArticleService(articleId, models) {
    try {
        const { Article } = models;

        const article = await Article.findByPk(articleId);
        if (!article)
            throw new Error("Article not found");

        await article.destroy()

        return article;
    } catch (error) {
        throw error;
    }
}
