import { v4 as uuidv4 } from "uuid";

export async function createTestArticle(models, options = {}) {
    const { Article } = models;

    const article = await Article.create({
        id: uuidv4(),
        title: options.title || "Test Article",
        summary: options.summary || "Résumé de test",
        content: options.content || [{ insert: "Contenu de test\n" }],
        status: options.status || "DRAFT",
        userId: options.authorId || uuidv4(),
        coverID: options.coverID || null,
        coverAlt: options.coverAlt || null,
    });

    return article;
}
