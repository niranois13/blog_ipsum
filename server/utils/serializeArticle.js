import cloudinary from "./cloudinary.cjs";

export default function serializeArticle(article) {
    if (!article) return null;
    const data = article.dataValues || article;
    if (!data) return null;
    return {
        ...data,
        coverUrl: data.coverID ? cloudinary.url(data.coverID, { format: "avif" }) : null,
        coverID: data.coverID,
    };
}
