import initUser from "../models/User.js";
import initArticle from "../models/Article.js";
import initComment from "../models/Comment.js";
import initCommentStats from "../models/CommentStats.js";

function applyAssociations(models) {
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

    return models;
}

function initModels(sequelize) {
    const User = initUser(sequelize);
    const Article = initArticle(sequelize);
    const Comment = initComment(sequelize);
    const CommentStats = initCommentStats(sequelize);

    return { User, Article, Comment, CommentStats };
}

export default function setupModels(sequelize) {
    const models = initModels(sequelize);
    applyAssociations(models);

    return models;
}
