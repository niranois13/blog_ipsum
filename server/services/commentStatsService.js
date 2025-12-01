import { Op, Sequelize } from "sequelize";

export async function handleRejectedCommentService(userId, models) {
    const { CommentStats } = models;

    await CommentStats.upsert({
        userId,
        totalRejected: Sequelize.literal("totalRejected + 1"),
        lastCommentAt: new Date(),
    });
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
                attributes: ["id", "username", "email"],
            },
        ],
        order: [["totalRejected", "DESC"]],
    });

    return suspsicious_users;
}
