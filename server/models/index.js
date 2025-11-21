export default function applyAssociations(models) {
    const { User, Article, Comment, CommentStats } = models;

    User.hasMany(Article, {
        foreignKey: "userId",
        as: "userArticles",
    });

    User.hasMany(Comment, {
        foreignKey: "userId",
        as: "userComments",
    });

    User.hasOne(CommentStats, {
        foreignKey: "userId",
        as: "userCommentStats",
    });

    Article.belongsTo(User, {
        foreignKey: "userId",
        as: "author",
    });
    Article.hasMany(Comment, {
        foreignKey: "articleId",
        as: "articleComments",
    });

    Comment.belongsTo(Comment, {
        foreignKey: "replyToId",
        as: "parent",
    });
    Comment.hasMany(Comment, {
        foreignKey: "replyToId",
        as: "replies",
    });

    Comment.belongsTo(User, {
        foreignKey: "userId",
        as: "author",
    });

    CommentStats.belongsTo(User, {
        foreignKey: "userId",
        as: "user",
    });
}
