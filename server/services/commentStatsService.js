import { Op, Sequelize } from "sequelize";

export async function handleRejectedCommentService(userId, models) {
    const { CommentStats } = models;

    const [stats] = await CommentStats.findOrCreate({
        where: { userId },
        defaults: {
            totalComments: 0,
            totalRejected: 0,
            lastCommentAt: new Date(),
        },
    });

    await stats.increment(
        {
            totalComments: 1,
            totalRejected: 1,
        },
        { silent: true }
    );

    await stats.update({ lastCommentAt: new Date() });
}

export async function getSusActivityService(models) {
    const { CommentStats, User } = models;

    const suspsicious_users = await CommentStats.findAll({
        where: Sequelize.where(
            Sequelize.literal(`totalRejected / (totalComments + totalRejected)`),
            { [Op.get]: 0.3 }
        ),
        include: [
            {
                model: User,
                attributes: ["id", "username"],
            },
        ],
        order: [["totalRejected", "DESC"]],
    });

    return suspsicious_users;
}
